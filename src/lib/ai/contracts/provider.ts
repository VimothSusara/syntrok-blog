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

export interface EmbeddingGenerationParams {
    modelSlug: string;
    input: string;
    config: Record<string, unknown>;
}

export interface EmbeddingGenerationResult {
    embedding: number[];
}

export interface AiProvider {
    slug: string;
    generateText(params: TextGenerationParams): Promise<TextGenerationResult>;
    generateEmbedding?(params: EmbeddingGenerationParams): Promise<EmbeddingGenerationResult>;
}
