import { z } from "zod";
import { AiError } from "@/lib/ai/errors";
import { extractJsonFromText } from "@/lib/ai/outputs/extract-json";

const tagsSchema = z.array(z.string().trim().min(1).max(40)).min(1).max(10);

export function parseSuggestTagsOutput(raw: string): string[] {
  try {
    return tagsSchema.parse(extractJsonFromText(raw));
  } catch {
    throw new AiError("AI returned invalid tag suggestions.");
  }
}
