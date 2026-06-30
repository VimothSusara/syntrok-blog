"use client";

import Link from "next/link";
import { useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import type { ReportAdminRow } from "@/lib/types/report-admin";
import {
  dismissReportAction,
  markReportReviewedAction,
} from "@/app/dashboard/admin/reports/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDisplayName } from "@/lib/users/display";

type ReportsAdminTableProps = {
  rows: ReportAdminRow[];
};

export function ReportsAdminTable({ rows }: ReportsAdminTableProps) {
  const [pending, startTransition] = useTransition();

  const run = (action: () => Promise<void>) => {
    startTransition(async () => {
      await action();
    });
  };

  if (!rows.length) {
    return (
      <p className="rounded-xl border border-border p-6 text-sm text-muted-foreground">
        No reports found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="min-w-full text-sm">
        <thead className="border-b border-border bg-muted/30 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">When</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Target</th>
            <th className="px-4 py-3 font-medium">Reason</th>
            <th className="px-4 py-3 font-medium">Reporter</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-border align-top last:border-0"
            >
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {formatDistanceToNow(row.createdAt, { addSuffix: true })}
              </td>
              <td className="px-4 py-3 capitalize">
                {row.targetType.toLowerCase()}
              </td>
              <td className="max-w-xs px-4 py-3">
                {row.targetHref ? (
                  <Link
                    href={row.targetHref}
                    className="line-clamp-3 font-medium hover:text-primary"
                  >
                    {row.targetSummary}
                  </Link>
                ) : (
                  <p className="line-clamp-3">{row.targetSummary}</p>
                )}
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {row.targetId}
                </p>
              </td>
              <td className="max-w-sm px-4 py-3">
                <p className="line-clamp-4 whitespace-pre-wrap">{row.reason}</p>
              </td>
              <td className="px-4 py-3">
                {row.reporter ? getDisplayName(row.reporter) : "Unknown"}
              </td>
              <td className="px-4 py-3">
                <Badge variant="secondary">{row.status.toLowerCase()}</Badge>
              </td>
              <td className="px-4 py-3">
                {row.status === "OPEN" ? (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={pending}
                      onClick={() =>
                        run(() => markReportReviewedAction(row.id))
                      }
                    >
                      Reviewed
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pending}
                      onClick={() => run(() => dismissReportAction(row.id))}
                    >
                      Dismiss
                    </Button>
                  </div>
                ) : row.reviewedAt ? (
                  <p className="text-xs text-muted-foreground">
                    Reviewed{" "}
                    {formatDistanceToNow(row.reviewedAt, { addSuffix: true })}
                  </p>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
