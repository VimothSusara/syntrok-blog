"use server";

import { revalidatePath } from "next/cache";
import {
  AuditAction,
  AuditEntityType,
  PostStatus,
} from "../../../../../generated/prisma/client";
import { logAudit } from "@/lib/audit/log-audit";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  canComment,
  canReactToPost,
  canSavePost,
} from "@/lib/auth/permissions";
import { CommentError, createComment } from "@/lib/db/comments";
import { parseCreateCommentForm } from "@/lib/validations/comment";
import { ReactionError, togglePostLike } from "@/lib/db/reactions";
import { PostSaveError, togglePostSave } from "@/lib/db/post-saves";

export type CommentActionState = {
  error?: string;
  success?: string;
};

export type PostLikeActionResult = {
  error?: string;
  liked?: boolean;
  likeCount?: number;
};

export type PostSaveActionResult = {
  error?: string;
  saved?: boolean;
};

export async function createCommentAction(
  _prev: CommentActionState,
  formData: FormData,
): Promise<CommentActionState> {
  const user = await getCurrentUser();
  if (!user || !canComment(user)) {
    return { error: "Sign in to comment." };
  }

  const parsed = parseCreateCommentForm(formData);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid comment.",
    };
  }

  try {
    const { comment, postSlug } = await createComment({
      postId: parsed.data.postId,
      userId: user.id,
      content: parsed.data.content,
      parentId: parsed.data.parentId,
    });

    await logAudit({
      action: AuditAction.COMMENT_CREATED,
      entityType: AuditEntityType.COMMENT,
      entityId: comment.id,
      actorUserId: user.id,
      metadata: {
        postId: comment.postId,
        status: comment.status,
        parentId: parsed.data.parentId ?? null,
      },
    });

    revalidatePath(`/posts/${postSlug}`);

    return {
      success: parsed.data.parentId ? "Reply posted." : "Comment posted.",
    };
  } catch (error) {
    if (error instanceof CommentError) {
      return { error: error.message };
    }
    return { error: "Could not post comment." };
  }
}

export async function togglePostLikeAction(
  postId: string,
  postSlug: string,
): Promise<PostLikeActionResult> {
  const user = await getCurrentUser();
  if (!user || !canReactToPost(user, { status: PostStatus.PUBLISHED })) {
    return { error: "Sign in to like posts." };
  }
  try {
    const result = await togglePostLike(postId, user.id);
    revalidatePath(`/posts/${postSlug}`);
    revalidatePath("/posts");
    return {
      liked: result.liked,
      likeCount: result.likeCount,
    };
  } catch (error) {
    if (error instanceof ReactionError) {
      return { error: error.message };
    }
    return { error: "Could not update like." };
  }
}

export async function togglePostSaveAction(
  postId: string,
  postSlug: string,
): Promise<PostSaveActionResult> {
  const user = await getCurrentUser();
  if (!user || !canSavePost(user, { status: PostStatus.PUBLISHED })) {
    return { error: "Sign in to save posts." };
  }
  try {
    const result = await togglePostSave(postId, user.id);
    revalidatePath(`/posts/${postSlug}`);
    revalidatePath("/dashboard/saved");
    return { saved: result.saved };
  } catch (error) {
    if (error instanceof PostSaveError) {
      return { error: error.message };
    }
    return { error: "Could not update save." };
  }
}
