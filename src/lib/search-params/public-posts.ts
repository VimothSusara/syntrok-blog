import { DEFAULT_PAGE_SIZE, parsePage } from "@/lib/pagination";
import { parseDateParam, formatDateParam } from "@/lib/date";
import { toParamArray } from "@/lib/urls/search-params";

export const PUBLIC_POST_SORTS = ["latest", "popular", "views"] as const;

export type PublicPostSort = (typeof PUBLIC_POST_SORTS)[number];

export type PublicPostFilters = {
  q?: string;
  categories: string[];
  tags: string[];
  authors: string[];
  from?: Date;
  to?: Date;
  sort: PublicPostSort;
  following: boolean;
  page: number;
  pageSize: number;
};

const SORT_SET = new Set<string>(PUBLIC_POST_SORTS);

function parseFollowingParam(raw: string | string[] | undefined): boolean {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === "1" || value === "true";
}

export function parsePublicPostFilters(
  raw: Record<string, string | string[] | undefined>,
): PublicPostFilters {
  const q = typeof raw.q === "string" ? raw.q.trim() : undefined;
  const sortRaw = typeof raw.sort === "string" ? raw.sort : "latest";

  return {
    q: q || undefined,
    categories: toParamArray(raw.category),
    tags: toParamArray(raw.tag),
    authors: toParamArray(raw.author),
    from: parseDateParam(typeof raw.from === "string" ? raw.from : undefined),
    to: parseDateParam(typeof raw.to === "string" ? raw.to : undefined),
    sort: SORT_SET.has(sortRaw) ? (sortRaw as PublicPostSort) : "latest",
    following: parseFollowingParam(raw.following),
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
    sort: filters.sort !== "latest" ? filters.sort : undefined,
    following: filters.following ? "1" : undefined,
    page: filters.page > 1 ? String(filters.page) : undefined,
  };
}

export const publicPostSortLabels: Record<PublicPostSort, string> = {
  latest: "Latest",
  popular: "Most liked",
  views: "Most viewed",
};
