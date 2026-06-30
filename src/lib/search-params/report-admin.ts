import { ADMIN_PAGE_SIZE, parsePage } from "@/lib/pagination";

export const REPORT_ADMIN_STATUSES = [
  "all",
  "OPEN",
  "REVIEWED",
  "DISMISSED",
] as const;

export const REPORT_ADMIN_TARGET_TYPES = [
  "all",
  "COMMENT",
  "POST",
  "USER",
] as const;

export type ReportAdminStatusFilter = (typeof REPORT_ADMIN_STATUSES)[number];
export type ReportAdminTargetFilter =
  (typeof REPORT_ADMIN_TARGET_TYPES)[number];

export type ReportAdminFilters = {
  q?: string;
  status: ReportAdminStatusFilter;
  targetType: ReportAdminTargetFilter;
  page: number;
  pageSize: number;
};

const STATUS_SET = new Set<string>(REPORT_ADMIN_STATUSES);
const TARGET_SET = new Set<string>(REPORT_ADMIN_TARGET_TYPES);

export function parseReportAdminFilters(
  raw: Record<string, string | string[] | undefined>,
): ReportAdminFilters {
  const q = typeof raw.q === "string" ? raw.q.trim() : undefined;
  const statusRaw = typeof raw.status === "string" ? raw.status : "OPEN";
  const targetRaw = typeof raw.targetType === "string" ? raw.targetType : "all";

  return {
    q: q || undefined,
    status: STATUS_SET.has(statusRaw)
      ? (statusRaw as ReportAdminStatusFilter)
      : "OPEN",
    targetType: TARGET_SET.has(targetRaw)
      ? (targetRaw as ReportAdminTargetFilter)
      : "all",
    page: parsePage(typeof raw.page === "string" ? raw.page : undefined),
    pageSize: ADMIN_PAGE_SIZE,
  };
}

export function reportAdminFiltersToParams(filters: ReportAdminFilters) {
  return {
    q: filters.q,
    status: filters.status !== "OPEN" ? filters.status : undefined,
    targetType: filters.targetType !== "all" ? filters.targetType : undefined,
    page: filters.page > 1 ? String(filters.page) : undefined,
  };
}
