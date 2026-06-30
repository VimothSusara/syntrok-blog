export type AiFeatureKey =
  | "post.summarize"
  | "post.seo_meta"
  | "post.suggest_tags"
  | "post.writing_assistant"
  | "post.related_posts"
  | "post.semantic_search"
  | "post.chat"
  | "post.image_generate";

export type TextAiFeatureKey = Extract<
  AiFeatureKey,
  | "post.summarize"
  | "post.seo_meta"
  | "post.suggest_tags"
  | "post.writing_assistant"
  | "post.chat"
>;

export type PostSeoMetaOutput = {
  title: string;
  description: string;
};
