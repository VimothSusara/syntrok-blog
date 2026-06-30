"use client";

import type { AuditAdminFilters } from "@/lib/search-params/audit-admin";
import { auditAdminFiltersToParams } from "@/lib/search-params/audit-admin";
import type { PaginationMeta } from "@/lib/pagination";
import { AuditLogTable } from "@/components/dashboard/admin/audit-log-table";
import { AuditAdminToolbar } from "@/components/dashboard/admin/audit-admin-toolbar";
import { Pagination } from "@/components/shared/pagination";
import { PageHeader } from "@/components/shared/page-header";
import { adminBreadcrumbs } from "@/lib/breadcrumbs";

type AuditLogRow = React.ComponentProps<typeof AuditLogTable>["logs"][number];

type AuditAdminPageContentProps = {
  rows: AuditLogRow[];
  total: number;
  pagination: PaginationMeta;
  filters: AuditAdminFilters;
};

export function AuditAdminPageContent({
  rows,
  total,
  pagination,
  filters,
}: AuditAdminPageContentProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={adminBreadcrumbs.section("Audit log")}
        title="Audit log"
        description="Platform actions with actor, target, and metadata. IP addresses are stored hashed for privacy."
        meta={
          total === 0
            ? "No audit events found."
            : `${total} event${total === 1 ? "" : "s"}`
        }
      />

      <AuditAdminToolbar basePath="/dashboard/admin/audit" filters={filters} />

      <AuditLogTable logs={rows} />

      <Pagination
        basePath="/dashboard/admin/audit"
        pagination={pagination}
        params={auditAdminFiltersToParams({ ...filters, page: 1 })}
      />
    </div>
  );
}
