import { loadFeatureConfig } from "@/lib/ai/config/loader";
import { renderTemplate } from "@/lib/ai/prompts/renderer";
import { getProvider } from "@/lib/ai/registry";
import { prisma } from "@/lib/prisma";
import type { AiFeatureKey } from "@/lib/ai/types";

type RunInput = {
  variables?: Record<string, string>;
  userId?: string;
  postId?: string;
};

export async function runAiFeature(
  featureKey: AiFeatureKey,
  input: RunInput = {},
) {
  const started = Date.now();
  const feature = await loadFeatureConfig(featureKey);

  if (!feature.textModel || !feature.promptTemplate) {
    throw new Error(`Feature ${featureKey} is missing text model or prompt`);
  }

  const provider = getProvider(feature.textModel.provider.slug);
  const prompt = renderTemplate(
    feature.promptTemplate.template,
    input.variables ?? {},
  );

  try {
    const result = await provider.generateText({
      modelSlug: feature.textModel.slug,
      prompt,
      config: {
        ...(feature.textModel.config as Record<string, unknown>),
        ...(feature.config as Record<string, unknown>),
      },
    });

    await prisma.aiUsageLog.create({
      data: {
        featureKey,
        providerSlug: feature.textModel.provider.slug,
        modelSlug: feature.textModel.slug,
        userId: input.userId,
        postId: input.postId,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        latencyMs: Date.now() - started,
        success: true,
      },
    });

    return result;
  } catch (error) {
    await prisma.aiUsageLog.create({
      data: {
        featureKey,
        providerSlug: feature.textModel.provider.slug,
        modelSlug: feature.textModel.slug,
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
