import { loadFeatureConfig } from "@/lib/ai/config/loader";
import { getFeatureHandler } from "@/lib/ai/features";
import { prisma } from "@/lib/prisma";
import type { AiFeatureKey } from "@/lib/ai/types";
import type { RunAiFeatureInput } from "@/lib/ai/contracts/feature";

export async function runAiFeature(
  featureKey: AiFeatureKey,
  input: RunAiFeatureInput = {},
) {
  const started = Date.now();
  const feature = await loadFeatureConfig(featureKey);
  const handler = getFeatureHandler(featureKey);

  try {
    const result = await handler.run({
      featureKey,
      feature,
      input,
    });

    await prisma.aiUsageLog.create({
      data: {
        featureKey,
        providerSlug: result.providerSlug ?? "unknown",
        modelSlug: result.modelSlug ?? "unknown",
        userId: input.userId,
        postId: input.postId,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        latencyMs: Date.now() - started,
        success: true,
      },
    });

    return result.output;
  } catch (error) {
    await prisma.aiUsageLog.create({
      data: {
        featureKey,
        providerSlug:
          feature.textModel?.provider.slug ??
          feature.embeddingModel?.provider.slug ??
          "unknown",
        modelSlug:
          feature.textModel?.slug ?? feature.embeddingModel?.slug ?? "unknown",
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