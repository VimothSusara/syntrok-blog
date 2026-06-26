import { prisma } from "@/lib/prisma";
import type { AiFeatureKey } from "@/lib/ai/types";

export async function loadFeatureConfig(featureKey: AiFeatureKey) {
  const feature = await prisma.aiFeatureConfig.findUnique({
    where: { featureKey },
    include: {
      textModel: { include: { provider: true } },
      embeddingModel: { include: { provider: true } },
      promptTemplate: true,
    },
  });

  if (!feature || !feature.isEnabled) {
    throw new Error(`AI feature disabled or missing: ${featureKey}`);
  }

  return feature;
}
