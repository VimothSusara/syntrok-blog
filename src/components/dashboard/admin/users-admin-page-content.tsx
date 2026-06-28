"use client";

import type { UserAdminFilters } from "@/lib/search-params/user-admin";
import { userAdminFiltersToParams } from "@/lib/search-params/user-admin";
import type { UserAdminRow } from "@/lib/types/user-admin";
import type { PaginationMeta } from "@/lib/pagination";
import { UsersAdminToolbar } from "@/components/dashboard/admin/users-admin-toolbar";
import { UsersAdminTable } from "@/components/dashboard/admin/users-admin-table";
import { Pagination } from "@/components/shared/pagination";

type UsersAdminPageContentProps = {
  rows: UserAdminRow[];
  total: number;
  pagination: PaginationMeta;
  filters: UserAdminFilters;
  currentUserId: string;
};

export function UsersAdminPageContent({
  rows,
  total,
  pagination,
  filters,
  currentUserId,
}: UsersAdminPageContentProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage accounts, roles, and access. Suspended or banned users cannot
          comment.
        </p>
        <p className="text-sm text-muted-foreground">
          {total === 0
            ? "No users found."
            : `${total} user${total === 1 ? "" : "s"}`}
        </p>
      </div>

      <UsersAdminToolbar basePath="/dashboard/admin/users" filters={filters} />

      <UsersAdminTable rows={rows} currentUserId={currentUserId} />

      <Pagination
        basePath="/dashboard/admin/users"
        pagination={pagination}
        params={userAdminFiltersToParams({ ...filters, page: 1 })}
      />
    </div>
  );
}
