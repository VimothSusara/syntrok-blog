import { ReportsAdminPageContent } from "@/components/dashboard/admin/reports-admin-page-content";
import { getReportsPaginated } from "@/lib/db/reports";
import { parseReportAdminFilters } from "@/lib/search-params/report-admin";

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const filters = parseReportAdminFilters(raw);
  const { items, total, pagination } = await getReportsPaginated(filters);

  return (
    <ReportsAdminPageContent
      rows={items}
      total={total}
      pagination={pagination}
      filters={filters}
    />
  );
}
