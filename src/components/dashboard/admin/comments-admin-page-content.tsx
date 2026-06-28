"use client";

import type { CommentAdminFilters } from "@/lib/search-params/comment-admin";
import { commentAdminFiltersToParams } from "@/lib/search-params/comment-admin";
import type { CommentAdminRow } from "@/lib/types/comment-admin";
import type { PaginationMeta } from "@/lib/pagination";
import { CommentsAdminToolbar } from "@/components/dashboard/admin/comments-admin-toolbar";
import { CommentsAdminTable } from "@/components/dashboard/admin/comments-admin-table";
import { Pagination } from "@/components/shared/pagination";

type CommentsAdminPageContentProps = {
  rows: CommentAdminRow[];
  total: number;
  pagination: PaginationMeta;
  filters: CommentAdminFilters;
};

export function CommentsAdminPageContent({
  rows,
  total,
  pagination,
  filters,
}: CommentsAdminPageContentProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Comments</h1>
        <p className="text-sm text-muted-foreground">
          Manage comments and replies. Hide, mark spam, or delete content when
          needed. Restore comments that were hidden by mistake.
        </p>
        <p className="text-sm text-muted-foreground">
          {total === 0
            ? "No comments found."
            : `${total} comment${total === 1 ? "" : "s"}`}
        </p>
      </div>

      <CommentsAdminToolbar
        basePath="/dashboard/admin/comments"
        filters={filters}
      />

      <CommentsAdminTable rows={rows} />

      <Pagination
        basePath="/dashboard/admin/comments"
        pagination={pagination}
        params={commentAdminFiltersToParams({ ...filters, page: 1 })}
      />
    </div>
  );
}
