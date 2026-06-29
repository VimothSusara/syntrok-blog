import type { AiFeatureHandler } from "@/lib/ai/contracts/feature";
import type { AiFeatureKey } from "@/lib/ai/types";
import { runTextFeature } from "@/lib/ai/features/text-feature";
import { runRelatedPostsFeature } from "@/lib/ai/features/related-posts.feature";
import { runSemanticSearchFeature } from "@/lib/ai/features/semantic-search.feature";

const featureHandlers: Partial<Record<AiFeatureKey, AiFeatureHandler>> = {
    "post.summarize": runTextFeature,
    "post.seo_meta": runTextFeature,
    "post.suggest_tags": runTextFeature,
    "post.writing_assistant": runTextFeature,
    "post.chat": runTextFeature,
    "post.related_posts": runRelatedPostsFeature,
    "post.semantic_search": runSemanticSearchFeature,
};

export function getFeatureHandler(featureKey: AiFeatureKey): AiFeatureHandler {
    const handler = featureHandlers[featureKey];
    if (!handler) {
        throw new Error(`No AI feature handler registered for ${featureKey}`);
    }
    return handler;
}