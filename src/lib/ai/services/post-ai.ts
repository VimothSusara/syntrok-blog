import "server-only";

import { runAiFeature } from "@/lib/ai/orchestrator";
import { AiError } from "@/lib/ai/errors";
import { parseSeoMetaOutput } from "@/lib/ai/outputs/parse-seo-meta";
import { parseSuggestTagsOutput } from "@/lib/ai/outputs/parse-suggest-tags";
import { tiptapJsonToPlainText } from "@/lib/posts/content";
import type { PostSeoMetaOutput, TextAiFeatureKey } from "@/lib/ai/types";

const MIN_CONTENT_LENGTH = 80;

function assertContent(content: string) {
  const plain = tiptapJsonToPlainText(content);
  if (plain.trim().length < MIN_CONTENT_LENGTH) {
    throw new AiError("Add more content before using AI features.");
  }
  return plain;
}

async function runTextFeature(
  featureKey: TextAiFeatureKey,
  input: {
    postId?: string;
    userId: string;
    content: string;
    extraVariables?: Record<string, string>;
  },
) {
  const plain = assertContent(input.content);

  const raw = await runAiFeature<string>(featureKey, {
    postId: input.postId,
    userId: input.userId,
    variables: {
      content: plain,
      ...input.extraVariables,
    },
  });

  if (typeof raw !== "string" || !raw.trim()) {
    throw new AiError("AI returned an empty response.");
  }

  return raw.trim();
}

export async function generatePostSummary(input: {
  postId?: string;
  userId: string;
  content: string;
}) {
  return runTextFeature("post.summarize", input);
}

export async function generatePostSeoMeta(input: {
  postId?: string;
  userId: string;
  content: string;
  title?: string;
}): Promise<PostSeoMetaOutput> {
  const plain = assertContent(input.content);
  const variables = {
    content: plain,
    ...(input.title ? { title: input.title } : {}),
  };

  const runOnce = (skipCache?: boolean) =>
    runAiFeature<string>(
      "post.seo_meta",
      {
        postId: input.postId,
        userId: input.userId,
        variables,
      },
      skipCache ? { skipCache: true } : undefined,
    );

  try {
    const raw = await runOnce();
    if (typeof raw !== "string" || !raw.trim()) {
      throw new AiError("AI returned an empty response.");
    }
    return parseSeoMetaOutput(raw.trim());
  } catch (error) {
    if (input.postId && error instanceof AiError) {
      const raw = await runOnce(true);
      if (typeof raw === "string" && raw.trim()) {
        return parseSeoMetaOutput(raw.trim());
      }
    }
    throw error;
  }
}

export async function suggestPostTags(input: {
  postId?: string;
  userId: string;
  content: string;
}) {
  const raw = await runTextFeature("post.suggest_tags", input);
  return parseSuggestTagsOutput(raw);
}

export async function improvePostWriting(input: {
  postId?: string;
  userId: string;
  content: string;
}) {
  return runTextFeature("post.writing_assistant", input);
}
