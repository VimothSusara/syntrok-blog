import type {
  AuditAction,
  AuditEntityType,
} from "../../../generated/prisma/client";

export const auditActionLabels: Record<AuditAction, string> = {
  USER_CREATED: "User created",
  USER_UPDATED: "User updated",
  USER_SUSPENDED: "User suspended",
  USER_BANNED: "User banned",
  USER_REACTIVATED: "User reactivated",
  USER_ROLE_CHANGED: "User role changed",
  POST_CREATED: "Post created",
  POST_UPDATED: "Post updated",
  POST_PUBLISHED: "Post published",
  POST_UNPUBLISHED: "Post unpublished",
  POST_DELETED: "Post deleted",
  COMMENT_CREATED: "Comment created",
  COMMENT_APPROVED: "Comment approved",
  COMMENT_REJECTED: "Comment rejected",
  COMMENT_DELETED: "Comment deleted",
  REPORT_REVIEWED: "Report reviewed",
  AI_FEATURE_USED: "AI feature used",
  ADMIN_SETTINGS_CHANGED: "Admin settings changed",
};

export const auditEntityLabels: Record<AuditEntityType, string> = {
  USER: "User",
  POST: "Post",
  COMMENT: "Comment",
  REPORT: "Report",
  AI_CONFIG: "AI config",
  SYSTEM: "System",
};

export function formatAuditAction(action: AuditAction) {
  return auditActionLabels[action] ?? action;
}

export function formatAuditEntity(entityType: AuditEntityType) {
  return auditEntityLabels[entityType] ?? entityType;
}
