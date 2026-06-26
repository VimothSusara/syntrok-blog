export type AiFeatureKey =
  | "post.summarize"
  | "post.seo_meta"
  | "post.suggest_tags"
  | "post.writing_assistant"
  | "post.related_posts"
  | "post.chat";

export interface TextGenerationParams {
  modelSlug: string;
  prompt: string;
  config: Record<string, unknown>;
}

export interface TextGenerationResult {
  text: string;
  inputTokens?: number;
  outputTokens?: number;
}

export interface AiProvider {
  slug: string;
  generateText(params: TextGenerationParams): Promise<TextGenerationResult>;
  generateEmbedding?(params: {
    modelSlug: string;
    input: string;
    config: Record<string, unknown>;
  }): Promise<number[]>;
}
