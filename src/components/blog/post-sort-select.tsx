"use client";

import {
  PUBLIC_POST_SORTS,
  publicPostSortLabels,
  type PublicPostFilters,
} from "@/lib/search-params/public-posts";

type PostSortSelectProps = {
  filters: PublicPostFilters;
  onChange: (next: PublicPostFilters) => void;
  disabled?: boolean;
};

export function PostSortSelect({
  filters,
  onChange,
  disabled,
}: PostSortSelectProps) {
  return (
    <select
      className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
      value={filters.sort}
      disabled={disabled}
      aria-label="Sort posts"
      onChange={(e) =>
        onChange({
          ...filters,
          sort: e.target.value as PublicPostFilters["sort"],
          page: 1,
        })
      }
    >
      {PUBLIC_POST_SORTS.map((sort) => (
        <option key={sort} value={sort}>
          {publicPostSortLabels[sort]}
        </option>
      ))}
    </select>
  );
}
