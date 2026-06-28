import { ADMIN_PAGE_SIZE, parsePage } from "@/lib/pagination";

export const COMMENT_ADMIN_STATUSES = [
  "all",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "SPAM",
  "DELETED",
] as const;

export type CommentAdminStatusFilter = (typeof COMMENT_ADMIN_STATUSES)[number];

/** Matches Prisma CommentStatus — for server-side DB queries only */
export type CommentModerationStatus = Exclude<CommentAdminStatusFilter, "all">;

export type CommentAdminFilters = {
  q?: string;
  status: CommentAdminStatusFilter;
  page: number;
  pageSize: number;
};

const STATUS_SET = new Set<string>(COMMENT_ADMIN_STATUSES);

export function parseCommentAdminFilters(
  raw: Record<string, string | string[] | undefined>,
): CommentAdminFilters {
  const q = typeof raw.q === "string" ? raw.q.trim() : undefined;
  const statusRaw = typeof raw.status === "string" ? raw.status : "all";

  return {
    q: q || undefined,
    status: STATUS_SET.has(statusRaw)
      ? (statusRaw as CommentAdminStatusFilter)
      : "all",
    page: parsePage(typeof raw.page === "string" ? raw.page : undefined),
    pageSize: ADMIN_PAGE_SIZE,
  };
}

export function commentAdminFiltersToParams(filters: CommentAdminFilters) {
  return {
    q: filters.q,
    status: filters.status !== "all" ? filters.status : undefined,
    page: filters.page > 1 ? String(filters.page) : undefined,
  };
}
