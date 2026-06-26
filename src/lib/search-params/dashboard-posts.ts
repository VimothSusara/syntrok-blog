import { DASHBOARD_PAGE_SIZE, parsePage } from "@/lib/pagination";

export const DASHBOARD_POST_STATUSES = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
  "ALL",
] as const;

export type DashboardPostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type DashboardPostFilters = {
  q?: string;
  status: DashboardPostStatus | "ALL";
  page: number;
  pageSize: number;
};

const STATUS_SET = new Set<string>(DASHBOARD_POST_STATUSES);

export function parseDashboardPostFilters(
  raw: Record<string, string | string[] | undefined>,
): DashboardPostFilters {
  const q = typeof raw.q === "string" ? raw.q.trim() : undefined;
  const statusRaw = typeof raw.status === "string" ? raw.status : "ALL";
  return {
    q: q || undefined,
    status: STATUS_SET.has(statusRaw)
      ? (statusRaw as DashboardPostFilters["status"])
      : "ALL",
    page: parsePage(typeof raw.page === "string" ? raw.page : undefined),
    pageSize: DASHBOARD_PAGE_SIZE,
  };
}

export function dashboardFiltersToParams(filters: DashboardPostFilters) {
  return {
    q: filters.q,
    status: filters.status !== "ALL" ? filters.status : undefined,
    page: filters.page > 1 ? String(filters.page) : undefined,
  };
}
