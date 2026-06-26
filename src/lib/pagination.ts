export const DEFAULT_PAGE_SIZE = 12;
export const DASHBOARD_PAGE_SIZE = 20;
export const ADMIN_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

export function parsePage(value: string | undefined, fallback = 1) {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function parsePageSize(value: string | undefined, fallback: number) {
  const n = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(n, MAX_PAGE_SIZE);
}

export function getSkip(page: number, pageSize: number) {
  return (page - 1) * pageSize;
}

export function buildPaginationMeta(
  page: number,
  pageSize: number,
  total: number,
): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  return {
    page: safePage,
    pageSize,
    total,
    totalPages,
    hasPrev: safePage > 1,
    hasNext: safePage < totalPages,
  };
}
