"use client";

import type { ReportAdminFilters } from "@/lib/search-params/report-admin";
import { reportAdminFiltersToParams } from "@/lib/search-params/report-admin";
import type { ReportAdminRow } from "@/lib/types/report-admin";
import type { PaginationMeta } from "@/lib/pagination";
import { ReportsAdminToolbar } from "@/components/dashboard/admin/reports-admin-toolbar";
import { ReportsAdminTable } from "@/components/dashboard/admin/reports-admin-table";
import { Pagination } from "@/components/shared/pagination";
import { PageHeader } from "@/components/shared/page-header";
import { adminBreadcrumbs } from "@/lib/breadcrumbs";

type ReportsAdminPageContentProps = {
  rows: ReportAdminRow[];
  total: number;
  pagination: PaginationMeta;
  filters: ReportAdminFilters;
};

export function ReportsAdminPageContent({
  rows,
  total,
  pagination,
  filters,
}: ReportsAdminPageContentProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={adminBreadcrumbs.section("Reports")}
        title="Reports"
        description="Review community reports for comments, posts, and users."
        meta={
          total === 0
            ? "No reports found."
            : `${total} report${total === 1 ? "" : "s"}`
        }
      />

      <ReportsAdminToolbar
        basePath="/dashboard/admin/reports"
        filters={filters}
      />

      <ReportsAdminTable rows={rows} />

      <Pagination
        basePath="/dashboard/admin/reports"
        pagination={pagination}
        params={reportAdminFiltersToParams({ ...filters, page: 1 })}
      />
    </div>
  );
}
