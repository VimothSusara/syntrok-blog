import type { Prisma } from "../../../../generated/prisma/client";
import type { AiFeatureKey } from "@/lib/ai/types";

export type RunAiFeatureInput = {
    variables?: Record<string, string>;
    userId?: string;
    postId?: string;
};

export type LoadedAiFeature = Prisma.AiFeatureConfigGetPayload<{
    include: {
        textModel: { include: { provider: true } };
        embeddingModel: { include: { provider: true } };
        promptTemplate: true;
    };
}>;

export type AiFeatureContext = {
    featureKey: AiFeatureKey;
    feature: LoadedAiFeature;
    input: RunAiFeatureInput;
};

export type AiFeatureResult<TOutput = unknown> = {
    output: TOutput;
    providerSlug?: string;
    modelSlug?: string;
    inputTokens?: number;
    outputTokens?: number;
};

export type AiFeatureHandler<TOutput = unknown> = {
    key: AiFeatureKey;
    run(context: AiFeatureContext): Promise<AiFeatureResult<TOutput>>;
};