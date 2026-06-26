"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  taxonomyAdminFiltersToParams,
  type TaxonomyAdminFilters,
} from "@/lib/search-params/taxonomy-admin";
import { buildQueryString } from "@/lib/urls/search-params";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type TaxonomyAdminToolbarProps = {
  basePath: string;
  filters: TaxonomyAdminFilters;
  createLabel: string;
  onCreateClick: () => void;
};

export function TaxonomyAdminToolbar({
  basePath,
  filters,
  createLabel,
  onCreateClick,
}: TaxonomyAdminToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigate = (next: Partial<TaxonomyAdminFilters>) => {
    const merged = { ...filters, ...next, page: 1 };
    startTransition(() => {
      router.push(
        `${basePath}${buildQueryString(taxonomyAdminFiltersToParams(merged))}`,
      );
    });
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <form
          className="flex flex-1 gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            navigate({ q: String(fd.get("q") ?? "").trim() || undefined });
          }}
        >
          <Input
            name="q"
            key={searchParams.get("q") ?? ""}
            defaultValue={filters.q ?? ""}
            placeholder="Search name, slug, description…"
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>

        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={filters.status}
          onChange={(e) =>
            navigate({
              status: e.target.value as TaxonomyAdminFilters["status"],
            })
          }
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {isPending && <Spinner className="size-4" />}
      </div>

      <Button type="button" onClick={onCreateClick}>
        {createLabel}
      </Button>
    </div>
  );
}
