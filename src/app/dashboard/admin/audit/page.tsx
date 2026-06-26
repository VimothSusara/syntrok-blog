import { AuditLogTable } from "@/components/dashboard/admin/audit-log-table";
import { getRecentAuditLogs } from "@/lib/db/audit-logs";

export default async function AdminAuditPage() {
  const logs = await getRecentAuditLogs(100);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Audit log</h1>
        <p className="text-sm text-muted-foreground">
          Recent platform actions. IP addresses are stored hashed for privacy.
        </p>
      </div>

      <AuditLogTable logs={logs} />
    </div>
  );
}
