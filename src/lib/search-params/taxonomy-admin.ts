import { ADMIN_PAGE_SIZE, parsePage } from "@/lib/pagination";

export const TAXONOMY_ADMIN_STATUSES = ["all", "active", "inactive"] as const;

export type TaxonomyAdminStatus = (typeof TAXONOMY_ADMIN_STATUSES)[number];

export type TaxonomyAdminFilters = {
  q?: string;
  status: TaxonomyAdminStatus;
  page: number;
  pageSize: number;
};

const STATUS_SET = new Set<string>(TAXONOMY_ADMIN_STATUSES);

export function parseTaxonomyAdminFilters(
  raw: Record<string, string | string[] | undefined>,
): TaxonomyAdminFilters {
  const q = typeof raw.q === "string" ? raw.q.trim() : undefined;
  const statusRaw = typeof raw.status === "string" ? raw.status : "all";

  return {
    q: q || undefined,
    status: STATUS_SET.has(statusRaw)
      ? (statusRaw as TaxonomyAdminStatus)
      : "all",
    page: parsePage(typeof raw.page === "string" ? raw.page : undefined),
    pageSize: ADMIN_PAGE_SIZE,
  };
}

export function taxonomyAdminFiltersToParams(filters: TaxonomyAdminFilters) {
  return {
    q: filters.q,
    status: filters.status !== "all" ? filters.status : undefined,
    page: filters.page > 1 ? String(filters.page) : undefined,
  };
}
