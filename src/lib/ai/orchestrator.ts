import { loadFeatureConfig } from "@/lib/ai/config/loader";
import { getFeatureHandler } from "@/lib/ai/features";
import { buildAiInputHash } from "@/lib/ai/cache/input-hash";
import {
  readPostAiCache,
  writePostAiCache,
} from "@/lib/ai/cache/post-ai-cache";
import { prisma } from "@/lib/prisma";
import type { AiFeatureKey } from "@/lib/ai/types";
import type { RunAiFeatureInput } from "@/lib/ai/contracts/feature";

type RunAiFeatureOptions = {
  skipCache?: boolean;
  cacheTtlHours?: number;
};

function resolveModelSlug(
  feature: Awaited<ReturnType<typeof loadFeatureConfig>>,
) {
  return feature.textModel?.slug ?? feature.embeddingModel?.slug ?? "unknown";
}

export async function runAiFeature<TOutput = unknown>(
  featureKey: AiFeatureKey,
  input: RunAiFeatureInput = {},
  options: RunAiFeatureOptions = {},
): Promise<TOutput> {
  const started = Date.now();
  const feature = await loadFeatureConfig(featureKey);
  const handler = getFeatureHandler(featureKey);
  const modelSlug = resolveModelSlug(feature);
  const variables = input.variables ?? {};

  const inputHash = buildAiInputHash({
    featureKey,
    modelSlug,
    variables,
  });

  if (input.postId && !options.skipCache) {
    const cached = await readPostAiCache<TOutput>({
      postId: input.postId,
      featureKey,
      inputHash,
    });
    if (cached !== null) return cached;
  }

  try {
    const result = await handler.run({
      featureKey,
      feature,
      input,
    });

    if (input.postId) {
      await writePostAiCache({
        postId: input.postId,
        featureKey,
        inputHash,
        modelSlug: result.modelSlug ?? modelSlug,
        output: result.output,
        ttlHours: options.cacheTtlHours ?? 168,
      });
    }

    await prisma.aiUsageLog.create({
      data: {
        featureKey,
        providerSlug: result.providerSlug ?? "unknown",
        modelSlug: result.modelSlug ?? modelSlug,
        userId: input.userId,
        postId: input.postId,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        latencyMs: Date.now() - started,
        success: true,
      },
    });

    return result.output as TOutput;
  } catch (error) {
    await prisma.aiUsageLog.create({
      data: {
        featureKey,
        providerSlug:
          feature.textModel?.provider.slug ??
          feature.embeddingModel?.provider.slug ??
          "unknown",
        modelSlug,
        userId: input.userId,
        postId: input.postId,
        latencyMs: Date.now() - started,
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      },
    });

    throw error;
  }
}
