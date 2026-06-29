import { getProvider } from "@/lib/ai/registry";
import { searchSemanticMatches } from "@/lib/ai/search/vector-search";
import type {
    AiFeatureContext,
    AiFeatureHandler,
    AiFeatureResult,
} from "@/lib/ai/contracts/feature";

export const runSemanticSearchFeature: AiFeatureHandler<
    {
        postId: string;
        chunkText: string;
        similarity: number;
    }[]
> = {
    key: "post.semantic_search",
    async run({ feature, input, featureKey }: AiFeatureContext) {
        if (!feature.embeddingModel) {
            throw new Error(`Feature ${featureKey} is missing an embedding model`);
        }

        const query = input.variables?.query?.trim();
        if (!query) {
            throw new Error("Semantic search requires query");
        }

        const provider = getProvider(feature.embeddingModel.provider.slug);
        if (!provider.generateEmbedding) {
            throw new Error(`Provider ${provider.slug} does not support embeddings`);
        }

        const { embedding } = await provider.generateEmbedding({
            modelSlug: feature.embeddingModel.slug,
            input: query,
            config: {
                ...(feature.embeddingModel.config as Record<string, unknown>),
                ...(feature.config as Record<string, unknown>),
            },
        });

        const rows = await searchSemanticMatches({
            embedding,
            limit: 20,
        });

        const output: AiFeatureResult<
            {
                postId: string;
                chunkText: string;
                similarity: number;
            }[]
        > = {
            output: rows,
            providerSlug: feature.embeddingModel.provider.slug,
            modelSlug: feature.embeddingModel.slug,
        };

        return output;
    },
};