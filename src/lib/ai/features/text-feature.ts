import { getProvider } from "@/lib/ai/registry";
import { renderTemplate } from "@/lib/ai/prompts/renderer";
import type {
    AiFeatureContext,
    AiFeatureHandler,
    AiFeatureResult,
} from "@/lib/ai/contracts/feature";

export const runTextFeature: AiFeatureHandler<string> = {
    key: "post.summarize",
    async run({ feature, input, featureKey }: AiFeatureContext) {
        if (!feature.textModel || !feature.promptTemplate) {
            throw new Error(`Feature ${featureKey} is missing text model or prompt`);
        }

        const provider = getProvider(feature.textModel.provider.slug);
        const prompt = renderTemplate(
            feature.promptTemplate.template,
            input.variables ?? {},
        );

        const result = await provider.generateText({
            modelSlug: feature.textModel.slug,
            prompt,
            config: {
                ...(feature.textModel.config as Record<string, unknown>),
                ...(feature.config as Record<string, unknown>),
            },
        });

        const output: AiFeatureResult<string> = {
            output: result.text,
            providerSlug: feature.textModel.provider.slug,
            modelSlug: feature.textModel.slug,
            inputTokens: result.inputTokens,
            outputTokens: result.outputTokens,
        };

        return output;
    },
};