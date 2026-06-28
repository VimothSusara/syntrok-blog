"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  commentAdminFiltersToParams,
  COMMENT_ADMIN_STATUSES,
  type CommentAdminFilters,
} from "@/lib/search-params/comment-admin";
import { buildQueryString } from "@/lib/urls/search-params";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type CommentsAdminToolbarProps = {
  basePath: string;
  filters: CommentAdminFilters;
};

export function CommentsAdminToolbar({
  basePath,
  filters,
}: CommentsAdminToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigate = (next: Partial<CommentAdminFilters>) => {
    const merged = { ...filters, ...next, page: 1 };
    startTransition(() => {
      router.push(
        `${basePath}${buildQueryString(commentAdminFiltersToParams(merged))}`,
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
          navigate({ q: String(fd.get("q") ?? "").trim() || undefined });
        }}
      >
        <Input
          name="q"
          key={searchParams.get("q") ?? ""}
          defaultValue={filters.q ?? ""}
          placeholder="Search comment, author, post…"
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
            status: e.target.value as CommentAdminFilters["status"],
          })
        }
      >
        {COMMENT_ADMIN_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status === "all" ? "All statuses" : status.toLowerCase()}
          </option>
        ))}
      </select>

      {isPending && <Spinner className="size-4" />}
    </div>
  );
}
