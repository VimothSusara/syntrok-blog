"use server";

import { revalidatePath } from "next/cache";
import {
  AuditAction,
  AuditEntityType,
  CommentStatus,
} from "../../../../../generated/prisma/client";
import { logAudit } from "@/lib/audit/log-audit";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isSuperAdmin } from "@/lib/auth/permissions";
import {
  getCommentForModeration,
  updateCommentStatus,
} from "@/lib/db/comments";

async function requireSuperAdmin() {
  const user = await getCurrentUser();
  if (!user || !isSuperAdmin(user)) return null;
  return user;
}

async function moderateComment(
  commentId: string,
  status: CommentStatus,
  auditAction: AuditAction,
) {
  const admin = await requireSuperAdmin();
  if (!admin) throw new Error("Unauthorized");

  const existing = await getCommentForModeration(commentId);
  if (!existing) throw new Error("Comment not found");

  const updated = await updateCommentStatus(commentId, status);

  await logAudit({
    action: auditAction,
    entityType: AuditEntityType.COMMENT,
    entityId: updated.id,
    actorUserId: admin.id,
    targetUserId: existing.userId,
    metadata: {
      from: existing.status,
      to: status,
      postId: existing.postId,
      postSlug: existing.post.slug,
    },
  });

  revalidatePath("/dashboard/admin/comments");
  revalidatePath(`/posts/${updated.post.slug}`);
}

export async function approveCommentAction(commentId: string) {
  await moderateComment(
    commentId,
    CommentStatus.APPROVED,
    AuditAction.COMMENT_APPROVED,
  );
}

export async function rejectCommentAction(commentId: string) {
  await moderateComment(
    commentId,
    CommentStatus.REJECTED,
    AuditAction.COMMENT_REJECTED,
  );
}

export async function markCommentSpamAction(commentId: string) {
  await moderateComment(
    commentId,
    CommentStatus.SPAM,
    AuditAction.COMMENT_REJECTED,
  );
}

export async function deleteCommentAction(commentId: string) {
  await moderateComment(
    commentId,
    CommentStatus.DELETED,
    AuditAction.COMMENT_DELETED,
  );
}
