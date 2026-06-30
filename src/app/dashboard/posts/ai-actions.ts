"use server";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { canUsePostAi } from "@/lib/auth/permissions";
import { getPostById } from "@/lib/db/posts";
import { AiError } from "@/lib/ai/errors";
import {
  generatePostSeoMeta,
  generatePostSummary,
  improvePostWriting,
  suggestPostTags,
} from "@/lib/ai/services/post-ai";
import type { PostSeoMetaOutput } from "@/lib/ai/types";

export type PostAiActionResult<T = string> = {
  error?: string;
  data?: T;
};

async function authorizePostAi(postId?: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to use AI features." as const };

  if (!postId) return { user };

  const post = await getPostById(postId);
  if (!post || !canUsePostAi(user, post)) {
    return {
      error: "You do not have permission to use AI on this post." as const,
    };
  }

  return { user, post };
}

function toResult<T>(fn: () => Promise<T>): Promise<PostAiActionResult<T>> {
  return fn().then(
    (data) => ({ data }),
    (error) => ({
      error:
        error instanceof AiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "AI request failed.",
    }),
  );
}

export async function generatePostSummaryAction(
  content: string,
  postId?: string,
): Promise<PostAiActionResult<string>> {
  const auth = await authorizePostAi(postId);
  if ("error" in auth && auth.error) return { error: auth.error };

  return toResult(() =>
    generatePostSummary({
      postId,
      userId: auth.user!.id,
      content,
    }),
  );
}

export async function generatePostSeoMetaAction(
  content: string,
  title: string,
  postId?: string,
): Promise<PostAiActionResult<PostSeoMetaOutput>> {
  const auth = await authorizePostAi(postId);
  if ("error" in auth && auth.error) return { error: auth.error };

  return toResult(() =>
    generatePostSeoMeta({
      postId,
      userId: auth.user!.id,
      content,
      title,
    }),
  );
}

export async function suggestPostTagsAction(
  content: string,
  postId?: string,
): Promise<PostAiActionResult<string[]>> {
  const auth = await authorizePostAi(postId);
  if ("error" in auth && auth.error) return { error: auth.error };

  return toResult(() =>
    suggestPostTags({
      postId,
      userId: auth.user!.id,
      content,
    }),
  );
}

export async function improvePostWritingAction(
  content: string,
  postId?: string,
): Promise<PostAiActionResult<string>> {
  const auth = await authorizePostAi(postId);
  if ("error" in auth && auth.error) return { error: auth.error };

  return toResult(() =>
    improvePostWriting({
      postId,
      userId: auth.user!.id,
      content,
    }),
  );
}
