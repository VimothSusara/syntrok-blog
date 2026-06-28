"use server";

import { revalidatePath } from "next/cache";
import {
  AuditAction,
  AuditEntityType,
} from "../../../../../generated/prisma/client";
import { logAudit } from "@/lib/audit/log-audit";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { canComment } from "@/lib/auth/permissions";
import { CommentError, createComment } from "@/lib/db/comments";
import { parseCreateCommentForm } from "@/lib/validations/comment";

export type CommentActionState = {
  error?: string;
  success?: string;
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
