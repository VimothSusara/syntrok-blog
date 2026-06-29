import { GoogleGenAI } from "@google/genai";
import type {
  AiProvider,
  EmbeddingGenerationParams,
  EmbeddingGenerationResult,
  TextGenerationParams,
  TextGenerationResult,
} from "@/lib/ai/contracts/provider";

export class GeminiProvider implements AiProvider {
  slug = "gemini";

  private getClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
    return new GoogleGenAI({ apiKey });
  }

  async generateText(
    params: TextGenerationParams,
  ): Promise<TextGenerationResult> {
    const client = this.getClient();

    const response = await client.models.generateContent({
      model: params.modelSlug,
      contents: params.prompt,
      config: {
        temperature: Number(params.config.temperature ?? 0.7),
        maxOutputTokens: Number(params.config.maxOutputTokens ?? 1024),
      },
    });

    return {
      text: response.text ?? "",
    };
  }

  async generateEmbedding(
    params: EmbeddingGenerationParams,
  ): Promise<EmbeddingGenerationResult> {
    const client = this.getClient();

    const response = await client.models.embedContent({
      model: params.modelSlug,
      contents: params.input,
      config: {
        outputDimensionality: Number(params.config.outputDimensionality ?? 768),
      },
    });

    const firstEmbedding = response.embeddings?.[0]?.values ?? [];

    return {
      embedding: firstEmbedding,
    };
  }
}