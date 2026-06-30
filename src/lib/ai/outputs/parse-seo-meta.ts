import { z } from "zod";
import { AiError } from "@/lib/ai/errors";
import { extractJsonFromText } from "@/lib/ai/outputs/extract-json";
import type { PostSeoMetaOutput } from "@/lib/ai/types";

const TITLE_KEYS = [
  "title",
  "seo_title",
  "seoTitle",
  "meta_title",
  "metaTitle",
] as const;

const DESCRIPTION_KEYS = [
  "description",
  "meta_description",
  "metaDescription",
  "seo_description",
  "seoDescription",
] as const;

const seoMetaSchema = z.object({
  title: z.string().trim().min(1).max(70),
  description: z.string().trim().min(1).max(320),
});

function pickString(
  obj: Record<string, unknown>,
  keys: readonly string[],
): string | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function normalizeSeoObject(
  input: unknown,
): { title: string; description: string } | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }

  const obj = input as Record<string, unknown>;

  for (const nestedKey of ["seo", "meta", "metadata"]) {
    const nested = obj[nestedKey];
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      const fromNested = normalizeSeoObject(nested);
      if (fromNested) return fromNested;
    }
  }

  const title = pickString(obj, TITLE_KEYS);
  const description = pickString(obj, DESCRIPTION_KEYS);

  if (!title || !description) return null;

  return {
    title: title.slice(0, 70),
    description: description.slice(0, 320),
  };
}

export function parseSeoMetaOutput(raw: string): PostSeoMetaOutput {
  try {
    const extracted = extractJsonFromText(raw);
    const normalized = normalizeSeoObject(extracted);

    if (!normalized) {
      throw new Error("Missing title or description");
    }

    return seoMetaSchema.parse(normalized);
  } catch {
    throw new AiError(
      "AI returned invalid SEO metadata. Try again or edit the fields manually.",
    );
  }
}
