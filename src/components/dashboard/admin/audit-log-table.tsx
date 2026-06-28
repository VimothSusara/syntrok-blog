import type { AuditLog, User } from "../../../../generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatAuditAction, formatAuditEntity } from "@/lib/audit/labels";

type AuditLogRow = AuditLog & {
  actor: Pick<User, "id" | "name" | "email"> | null;
  targetUser: Pick<User, "id" | "name" | "email"> | null;
};

function actorLabel(user: AuditLogRow["actor"]) {
  if (!user) return "System";
  return user.name ?? user.email;
}

export function AuditLogTable({ logs }: { logs: AuditLogRow[] }) {
  if (!logs.length) {
    return (
      <p className="text-sm text-muted-foreground">No audit events yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border scrollbar-themed">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/40 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">When</th>
            <th className="px-4 py-3 font-medium">Action</th>
            <th className="px-4 py-3 font-medium">Entity</th>
            <th className="px-4 py-3 font-medium">Actor</th>
            <th className="px-4 py-3 font-medium">Target user</th>
            <th className="px-4 py-3 font-medium">Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {log.createdAt.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <Badge variant="secondary">
                  {formatAuditAction(log.action)}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div>{formatAuditEntity(log.entityType)}</div>
                {log.entityId && (
                  <div className="text-xs text-muted-foreground font-mono">
                    {log.entityId}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">{actorLabel(log.actor)}</td>
              <td className="px-4 py-3">
                {log.targetUser ? actorLabel(log.targetUser) : "—"}
              </td>
              <td className="px-4 py-3 max-w-xs">
                <pre className="overflow-x-auto text-xs text-muted-foreground whitespace-pre-wrap break-all">
                  {JSON.stringify(log.metadata, null, 0)}
                </pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
