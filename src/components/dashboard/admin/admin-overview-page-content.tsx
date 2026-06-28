import Link from "next/link";
import { adminNavItems } from "@/config/admin-nav";
import { formatAuditAction, formatAuditEntity } from "@/lib/audit/labels";
import type {
  AdminOverviewAuditRow,
  AdminOverviewStats,
} from "@/lib/types/admin-overview";
import { navIcons } from "@/lib/nav-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { adminBreadcrumbs } from "@/lib/breadcrumbs";

type AdminOverviewPageContentProps = {
  stats: AdminOverviewStats;
  recentAuditLogs: AdminOverviewAuditRow[];
};

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      {hint ? (
        <CardContent className="pt-0 text-xs text-muted-foreground">
          {hint}
        </CardContent>
      ) : null}
    </Card>
  );
}

function actorLabel(actor: AdminOverviewAuditRow["actor"]) {
  if (!actor) return "System";
  return actor.name ?? actor.email;
}

export function AdminOverviewPageContent({
  stats,
  recentAuditLogs,
}: AdminOverviewPageContentProps) {
  const quickLinks = adminNavItems.filter((item) => !item.exact);

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={adminBreadcrumbs.overview()}
        title="Administration"
        description="Platform snapshot and quick links to governance tools."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Users"
          value={stats.users.total}
          hint={`${stats.users.active} active`}
        />
        <StatCard
          label="Published posts"
          value={stats.posts.published}
          hint={`${stats.posts.draft} drafts`}
        />
        <StatCard
          label="Comments"
          value={stats.comments.total}
          hint={`${stats.comments.hidden} hidden/moderated`}
        />
        <StatCard
          label="Open reports"
          value={stats.reports.open}
          hint={`${stats.taxonomy.categories} categories · ${stats.taxonomy.tags} tags`}
        />
      </section>

      {(stats.users.suspended > 0 || stats.users.banned > 0) && (
        <div className="flex flex-wrap gap-2">
          {stats.users.suspended > 0 && (
            <Badge variant="secondary">{stats.users.suspended} suspended</Badge>
          )}
          {stats.users.banned > 0 && (
            <Badge variant="destructive">{stats.users.banned} banned</Badge>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/admin/users">Review users</Link>
          </Button>
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Quick links</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = navIcons[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                {item.title}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Recent audit events</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/admin/audit">View all</Link>
          </Button>
        </div>

        {recentAuditLogs.length ? (
          <div className="overflow-x-auto rounded-xl border border-border scrollbar-themed">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">When</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Entity</th>
                  <th className="px-4 py-3 font-medium">Actor</th>
                </tr>
              </thead>
              <tbody>
                {recentAuditLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {log.createdAt.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">
                        {formatAuditAction(log.action)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {formatAuditEntity(log.entityType)}
                    </td>
                    <td className="px-4 py-3">{actorLabel(log.actor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No audit events yet.</p>
        )}
      </section>
    </div>
  );
}
