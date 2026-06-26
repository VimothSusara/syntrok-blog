"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { AuthorMultiSelect } from "@/components/filters/author-multi-select";
import { TaxonomyMultiSelect } from "@/components/filters/taxonomy-multi-select";
import { DateRangeFilter } from "@/components/filters/date-range-filter";
import type { PublicPostFilters } from "@/lib/search-params/public-posts";
import type { AuthorOption } from "@/components/filters/author-multi-select";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type FilterOptions = {
  categories: { slug: string; name: string; count?: number }[];
  tags: { slug: string; name: string; count?: number }[];
  authors: AuthorOption[];
};

type PostFiltersSheetProps = {
  filters: PublicPostFilters;
  options: FilterOptions;
  activeCount: number;
  onApply: (next: PublicPostFilters) => void;
};

export function PostFiltersSheet({
  filters,
  options,
  activeCount,
  onApply,
}: PostFiltersSheetProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(filters);

  const openSheet = (next: boolean) => {
    if (next) setDraft(filters);
    setOpen(next);
  };

  return (
    <Sheet open={open} onOpenChange={openSheet}>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Filter className="size-4" />
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filter posts</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 px-4">
          <section className="space-y-2">
            <h3 className="text-sm font-medium">Categories</h3>
            <TaxonomyMultiSelect
              items={options.categories}
              value={draft.categories}
              onChange={(categories) =>
                setDraft((prev) => ({ ...prev, categories }))
              }
              placeholder="Select categories"
              searchPlaceholder="Search categories…"
            />
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-medium">Tags</h3>
            <TaxonomyMultiSelect
              items={options.tags}
              value={draft.tags}
              onChange={(tags) => setDraft((prev) => ({ ...prev, tags }))}
              placeholder="Select tags"
              searchPlaceholder="Search tags…"
            />
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-medium">Authors</h3>
            <AuthorMultiSelect
              authors={options.authors}
              value={draft.authors}
              onChange={(authors) => setDraft((prev) => ({ ...prev, authors }))}
            />
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-medium">Published date</h3>
            <DateRangeFilter
              from={draft.from}
              to={draft.to}
              onChange={({ from, to }) =>
                setDraft((prev) => ({ ...prev, from, to }))
              }
            />
          </section>
        </div>

        <SheetFooter className="flex-row justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              setDraft({
                ...filters,
                categories: [],
                tags: [],
                authors: [],
                from: undefined,
                to: undefined,
                page: 1,
              })
            }
          >
            Clear
          </Button>
          <Button
            type="button"
            onClick={() => {
              onApply({ ...draft, page: 1 });
              setOpen(false);
            }}
          >
            Apply filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
