import { prisma } from "@/lib/prisma";

export async function readPostAiCache<T>(input: {
  postId: string;
  featureKey: string;
  inputHash: string;
}): Promise<T | null> {
  const row = await prisma.postAiCache.findUnique({
    where: {
      postId_featureKey_inputHash: {
        postId: input.postId,
        featureKey: input.featureKey,
        inputHash: input.inputHash,
      },
    },
  });

  if (!row) return null;
  if (row.expiresAt && row.expiresAt <= new Date()) return null;

  return row.output as T;
}

export async function writePostAiCache(input: {
  postId: string;
  featureKey: string;
  inputHash: string;
  modelSlug: string;
  output: unknown;
  ttlHours?: number;
}) {
  const expiresAt =
    input.ttlHours && input.ttlHours > 0
      ? new Date(Date.now() + input.ttlHours * 60 * 60 * 1000)
      : null;

  await prisma.postAiCache.upsert({
    where: {
      postId_featureKey_inputHash: {
        postId: input.postId,
        featureKey: input.featureKey,
        inputHash: input.inputHash,
      },
    },
    update: {
      output: input.output as object,
      modelSlug: input.modelSlug,
      expiresAt,
    },
    create: {
      postId: input.postId,
      featureKey: input.featureKey,
      inputHash: input.inputHash,
      modelSlug: input.modelSlug,
      output: input.output as object,
      expiresAt,
    },
  });
}
