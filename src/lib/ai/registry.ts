import type { AiProvider } from "@/lib/ai/types";
import { GeminiProvider } from "@/lib/ai/providers/gemini/gemini.provider";

const providers: Record<string, AiProvider> = {
  gemini: new GeminiProvider(),
};

export function getProvider(slug: string): AiProvider {
  const provider = providers[slug];
  if (!provider) throw new Error(`Unknown AI provider: ${slug}`);
  return provider;
}
