import { AuditAdminPageContent } from "@/components/dashboard/admin/audit-admin-page-content";
import { getAuditLogsPaginated } from "@/lib/db/audit-logs";
import { parseAuditAdminFilters } from "@/lib/search-params/audit-admin";

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const filters = parseAuditAdminFilters(raw);
  const { items, total, pagination } = await getAuditLogsPaginated(filters);

  return (
    <AuditAdminPageContent
      rows={items}
      total={total}
      pagination={pagination}
      filters={filters}
    />
  );
}
