import { getProvider } from "@/lib/ai/registry";
import { findRelatedPosts } from "@/lib/ai/search/vector-search";
import type {
  AiFeatureContext,
  AiFeatureHandler,
  AiFeatureResult,
} from "@/lib/ai/contracts/feature";

export const runRelatedPostsFeature: AiFeatureHandler<
  { postId: string; similarity: number }[]
> = {
  key: "post.related_posts",
  async run({ feature, input, featureKey }: AiFeatureContext) {
    if (!feature.embeddingModel) {
      throw new Error(`Feature ${featureKey} is missing an embedding model`);
    }

    const sourceText = input.variables?.sourceText?.trim();
    if (!sourceText) {
      throw new Error("Related posts feature requires sourceText");
    }

    const provider = getProvider(feature.embeddingModel.provider.slug);
    if (!provider.generateEmbedding) {
      throw new Error(`Provider ${provider.slug} does not support embeddings`);
    }

    const { embedding } = await provider.generateEmbedding({
      modelSlug: feature.embeddingModel.slug,
      input: sourceText,
      config: {
        ...(feature.embeddingModel.config as Record<string, unknown>),
        ...(feature.config as Record<string, unknown>),
      },
    });

    const rows = await findRelatedPosts({
      embedding,
      excludePostId: input.postId,
      limit: 6,
    });

    return {
      output: rows,
      providerSlug: feature.embeddingModel.provider.slug,
      modelSlug: feature.embeddingModel.slug,
    };
  },
};
