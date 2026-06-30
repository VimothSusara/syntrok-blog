import { prisma } from "@/lib/prisma";

export async function getAiAdminOverview() {
  const [providers, models, features, templates] = await Promise.all([
    prisma.aiProvider.findMany({
      orderBy: { displayName: "asc" },
      include: {
        _count: { select: { models: true } },
      },
    }),
    prisma.aiModel.findMany({
      orderBy: [{ providerId: "asc" }, { displayName: "asc" }],
      include: {
        provider: { select: { slug: true, displayName: true } },
      },
    }),
    prisma.aiFeatureConfig.findMany({
      orderBy: { displayName: "asc" },
      include: {
        textModel: {
          select: {
            slug: true,
            displayName: true,
            provider: { select: { displayName: true } },
          },
        },
        embeddingModel: {
          select: {
            slug: true,
            displayName: true,
            provider: { select: { displayName: true } },
          },
        },
        promptTemplate: {
          select: { key: true, name: true, version: true, isActive: true },
        },
      },
    }),
    prisma.aiPromptTemplate.findMany({
      orderBy: [{ key: "asc" }, { version: "desc" }],
      take: 20,
    }),
  ]);

  return { providers, models, features, templates };
}

export type AiAdminOverview = Awaited<ReturnType<typeof getAiAdminOverview>>;
