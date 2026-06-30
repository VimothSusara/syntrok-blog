"use server";

import { revalidatePath } from "next/cache";
import {
  AuditAction,
  AuditEntityType,
  ReportStatus,
} from "../../../../../generated/prisma/client";
import { logAudit } from "@/lib/audit/log-audit";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isSuperAdmin } from "@/lib/auth/permissions";
import { getReportForAdminAction, updateReportStatus } from "@/lib/db/reports";

async function requireSuperAdmin() {
  const user = await getCurrentUser();
  if (!user || !isSuperAdmin(user)) return null;
  return user;
}

async function reviewReport(reportId: string, status: ReportStatus) {
  const admin = await requireSuperAdmin();
  if (!admin) throw new Error("Unauthorized");

  const existing = await getReportForAdminAction(reportId);
  if (!existing) throw new Error("Report not found");

  const updated = await updateReportStatus(reportId, status);

  await logAudit({
    action: AuditAction.REPORT_REVIEWED,
    entityType: AuditEntityType.REPORT,
    entityId: updated.id,
    actorUserId: admin.id,
    metadata: {
      from: existing.status,
      to: status,
      targetType: updated.targetType,
      targetId: updated.targetId,
    },
  });

  revalidatePath("/dashboard/admin/reports");
  revalidatePath("/dashboard/admin");
}

export async function markReportReviewedAction(reportId: string) {
  await reviewReport(reportId, ReportStatus.REVIEWED);
}

export async function dismissReportAction(reportId: string) {
  await reviewReport(reportId, ReportStatus.DISMISSED);
}
