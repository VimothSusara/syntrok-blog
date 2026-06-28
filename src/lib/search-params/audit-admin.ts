import { ADMIN_PAGE_SIZE, parsePage } from "@/lib/pagination";

export const AUDIT_ADMIN_ACTIONS = [
  "all",
  "USER_CREATED",
  "USER_UPDATED",
  "USER_SUSPENDED",
  "USER_BANNED",
  "USER_REACTIVATED",
  "USER_ROLE_CHANGED",
  "POST_CREATED",
  "POST_UPDATED",
  "POST_PUBLISHED",
  "POST_UNPUBLISHED",
  "POST_DELETED",
  "COMMENT_CREATED",
  "COMMENT_APPROVED",
  "COMMENT_REJECTED",
  "COMMENT_DELETED",
  "REPORT_REVIEWED",
  "AI_FEATURE_USED",
  "ADMIN_SETTINGS_CHANGED",
] as const;

export const AUDIT_ADMIN_ENTITIES = [
  "all",
  "USER",
  "POST",
  "COMMENT",
  "REPORT",
  "AI_CONFIG",
  "SYSTEM",
] as const;

export type AuditAdminActionFilter = (typeof AUDIT_ADMIN_ACTIONS)[number];
export type AuditAdminEntityFilter = (typeof AUDIT_ADMIN_ENTITIES)[number];

export type AuditAdminFilters = {
  q?: string;
  action: AuditAdminActionFilter;
  entity: AuditAdminEntityFilter;
  page: number;
  pageSize: number;
};

const ACTION_SET = new Set<string>(AUDIT_ADMIN_ACTIONS);
const ENTITY_SET = new Set<string>(AUDIT_ADMIN_ENTITIES);

export function parseAuditAdminFilters(
  raw: Record<string, string | string[] | undefined>,
): AuditAdminFilters {
  const q = typeof raw.q === "string" ? raw.q.trim() : undefined;
  const actionRaw = typeof raw.action === "string" ? raw.action : "all";
  const entityRaw = typeof raw.entity === "string" ? raw.entity : "all";

  return {
    q: q || undefined,
    action: ACTION_SET.has(actionRaw)
      ? (actionRaw as AuditAdminActionFilter)
      : "all",
    entity: ENTITY_SET.has(entityRaw)
      ? (entityRaw as AuditAdminEntityFilter)
      : "all",
    page: parsePage(typeof raw.page === "string" ? raw.page : undefined),
    pageSize: ADMIN_PAGE_SIZE,
  };
}

export function auditAdminFiltersToParams(filters: AuditAdminFilters) {
  return {
    q: filters.q,
    action: filters.action !== "all" ? filters.action : undefined,
    entity: filters.entity !== "all" ? filters.entity : undefined,
    page: filters.page > 1 ? String(filters.page) : undefined,
  };
}
