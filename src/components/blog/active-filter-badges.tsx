"use client";

import { X } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { PublicPostFilters } from "@/lib/search-params/public-posts";
import type { PostFilterOptions } from "@/lib/db/post-filter-options";

type ActiveFilterBadgesProps = {
  filters: PublicPostFilters;
  options: PostFilterOptions;
  onChange: (next: PublicPostFilters) => void;
};

export function ActiveFilterBadges({
  filters,
  options,
  onChange,
}: ActiveFilterBadgesProps) {
  const badges: { key: string; label: string; clear: () => void }[] = [];

  for (const slug of filters.categories) {
    const name = options.categories.find((c) => c.slug === slug)?.name ?? slug;
    badges.push({
      key: `cat-${slug}`,
      label: `Category: ${name}`,
      clear: () =>
        onChange({
          ...filters,
          categories: filters.categories.filter((s) => s !== slug),
          page: 1,
        }),
    });
  }

  for (const slug of filters.tags) {
    const name = options.tags.find((t) => t.slug === slug)?.name ?? slug;
    badges.push({
      key: `tag-${slug}`,
      label: `Tag: ${name}`,
      clear: () =>
        onChange({
          ...filters,
          tags: filters.tags.filter((s) => s !== slug),
          page: 1,
        }),
    });
  }

  for (const id of filters.authors) {
    const author = options.authors.find((a) => a.id === id);
    badges.push({
      key: `author-${id}`,
      label: `Author: ${author?.name ?? author?.email ?? id}`,
      clear: () =>
        onChange({
          ...filters,
          authors: filters.authors.filter((a) => a !== id),
          page: 1,
        }),
    });
  }

  if (filters.from || filters.to) {
    const from = filters.from ? format(filters.from, "MMM d, yyyy") : "…";
    const to = filters.to ? format(filters.to, "MMM d, yyyy") : "…";
    badges.push({
      key: "date",
      label: `Date: ${from} – ${to}`,
      clear: () =>
        onChange({ ...filters, from: undefined, to: undefined, page: 1 }),
    });
  }

  if (!badges.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <Badge key={badge.key} variant="secondary" className="gap-1">
          {badge.label}
          <button
            type="button"
            onClick={badge.clear}
            aria-label={`Remove ${badge.label}`}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
