import { AiModelType } from "../../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { AiError } from "@/lib/ai/errors";
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
    throw new AiError(`AI feature disabled or missing: ${featureKey}`);
  }

  const needsText = [
    "post.summarize",
    "post.seo_meta",
    "post.suggest_tags",
    "post.writing_assistant",
    "post.chat",
  ].includes(featureKey);

  const needsEmbedding = [
    "post.semantic_search",
    "post.related_posts",
  ].includes(featureKey);

  if (needsText) {
    if (!feature.textModel || !feature.textModel.isEnabled) {
      throw new AiError(`Text model missing or disabled for ${featureKey}`);
    }
    if (!feature.textModel.provider.isEnabled) {
      throw new AiError(`Provider disabled for ${featureKey}`);
    }
    if (feature.textModel.modelType !== AiModelType.TEXT) {
      throw new AiError(`Invalid text model type for ${featureKey}`);
    }
    if (!feature.promptTemplate || !feature.promptTemplate.isActive) {
      throw new AiError(
        `Prompt template missing or inactive for ${featureKey}`,
      );
    }
  }

  if (needsEmbedding) {
    if (!feature.embeddingModel || !feature.embeddingModel.isEnabled) {
      throw new AiError(
        `Embedding model missing or disabled for ${featureKey}`,
      );
    }
    if (!feature.embeddingModel.provider.isEnabled) {
      throw new AiError(`Provider disabled for ${featureKey}`);
    }
    if (feature.embeddingModel.modelType !== AiModelType.EMBEDDING) {
      throw new AiError(`Invalid embedding model type for ${featureKey}`);
    }
  }

  return feature;
}
