"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  dashboardFiltersToParams,
  type DashboardPostFilters,
} from "@/lib/search-params/dashboard-posts";
import { buildQueryString } from "@/lib/urls/search-params";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function PostsTableToolbar({
  filters,
}: {
  filters: DashboardPostFilters;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const apply = (next: Partial<DashboardPostFilters>) => {
    const merged = { ...filters, ...next, page: 1 };
    startTransition(() => {
      router.push(
        `/dashboard/posts${buildQueryString(dashboardFiltersToParams(merged))}`,
      );
    });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <form
        className="flex flex-1 gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          apply({ q: String(fd.get("q") ?? "").trim() || undefined });
        }}
      >
        <Input
          name="q"
          key={searchParams.get("q") ?? ""}
          defaultValue={filters.q ?? ""}
          placeholder="Search title or slug…"
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
          apply({ status: e.target.value as DashboardPostFilters["status"] })
        }
      >
        <option value="ALL">All statuses</option>
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
        <option value="ARCHIVED">Archived</option>
      </select>

      {isPending && <Spinner className="size-4" />}
    </div>
  );
}
