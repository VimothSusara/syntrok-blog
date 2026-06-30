"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  reportAdminFiltersToParams,
  REPORT_ADMIN_STATUSES,
  REPORT_ADMIN_TARGET_TYPES,
  type ReportAdminFilters,
} from "@/lib/search-params/report-admin";
import { buildQueryString } from "@/lib/urls/search-params";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type ReportsAdminToolbarProps = {
  basePath: string;
  filters: ReportAdminFilters;
};

export function ReportsAdminToolbar({
  basePath,
  filters,
}: ReportsAdminToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigate = (next: Partial<ReportAdminFilters>) => {
    const merged = { ...filters, ...next, page: 1 };
    startTransition(() => {
      router.push(
        `${basePath}${buildQueryString(reportAdminFiltersToParams(merged))}`,
      );
    });
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
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
          placeholder="Search reason, reporter, target id…"
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
            status: e.target.value as ReportAdminFilters["status"],
          })
        }
      >
        {REPORT_ADMIN_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status === "all" ? "All statuses" : status.toLowerCase()}
          </option>
        ))}
      </select>

      <select
        className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
        value={filters.targetType}
        onChange={(e) =>
          navigate({
            targetType: e.target.value as ReportAdminFilters["targetType"],
          })
        }
      >
        {REPORT_ADMIN_TARGET_TYPES.map((type) => (
          <option key={type} value={type}>
            {type === "all" ? "All types" : type.toLowerCase()}
          </option>
        ))}
      </select>

      {isPending && <Spinner className="size-4" />}
    </div>
  );
}
