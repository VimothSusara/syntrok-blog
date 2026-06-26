import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  AiProvider,
  TextGenerationParams,
  TextGenerationResult,
} from "@/lib/ai/types";

export class GeminiProvider implements AiProvider {
  slug = "gemini";

  private getClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
    return new GoogleGenerativeAI(apiKey);
  }

  async generateText(
    params: TextGenerationParams,
  ): Promise<TextGenerationResult> {
    const client = this.getClient();
    const model = client.getGenerativeModel({
      model: params.modelSlug,
      generationConfig: {
        temperature: Number(params.config.temperature ?? 0.7),
        maxOutputTokens: Number(params.config.maxOutputTokens ?? 1024),
      },
    });

    const result = await model.generateContent(params.prompt);
    const text = result.response.text();
    return { text };
  }
}
