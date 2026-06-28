import { AdminOverviewPageContent } from "@/components/dashboard/admin/admin-overview-page-content";
import {
  getAdminOverviewRecentAuditLogs,
  getAdminOverviewStats,
} from "@/lib/db/admin-overview";

export default async function AdminPage() {
  const [stats, recentAuditLogs] = await Promise.all([
    getAdminOverviewStats(),
    getAdminOverviewRecentAuditLogs(5),
  ]);

  return (
    <AdminOverviewPageContent stats={stats} recentAuditLogs={recentAuditLogs} />
  );
}
