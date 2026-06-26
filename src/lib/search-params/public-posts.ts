import { DEFAULT_PAGE_SIZE, parsePage } from "@/lib/pagination";
import { parseDateParam, formatDateParam } from "@/lib/date";
import { toParamArray } from "@/lib/urls/search-params";

export type PublicPostFilters = {
  q?: string;
  categories: string[];
  tags: string[];
  authors: string[];
  from?: Date;
  to?: Date;
  page: number;
  pageSize: number;
};

export function parsePublicPostFilters(
  raw: Record<string, string | string[] | undefined>,
): PublicPostFilters {
  const q = typeof raw.q === "string" ? raw.q.trim() : undefined;
  return {
    q: q || undefined,
    categories: toParamArray(raw.category),
    tags: toParamArray(raw.tag),
    authors: toParamArray(raw.author),
    from: parseDateParam(typeof raw.from === "string" ? raw.from : undefined),
    to: parseDateParam(typeof raw.to === "string" ? raw.to : undefined),
    page: parsePage(typeof raw.page === "string" ? raw.page : undefined),
    pageSize: DEFAULT_PAGE_SIZE,
  };
}

export function publicFiltersToParams(filters: PublicPostFilters) {
  return {
    q: filters.q,
    category: filters.categories,
    tag: filters.tags,
    author: filters.authors,
    from: filters.from ? formatDateParam(filters.from) : undefined,
    to: filters.to ? formatDateParam(filters.to) : undefined,
    page: filters.page > 1 ? String(filters.page) : undefined,
  };
}
