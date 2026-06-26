import "server-only";

import type { Prisma } from "../../../generated/prisma/client";
import { AuditAction, AuditEntityType } from "../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getRequestAuditContext } from "@/lib/audit/request-context";

export type LogAuditInput = {
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: string | null;
  actorUserId?: string | null;
  targetUserId?: string | null;
  metadata?: Prisma.InputJsonValue;
};

export async function logAudit(input: LogAuditInput) {
  try {
    const ctx = await getRequestAuditContext();

    await prisma.auditLog.create({
      data: {
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        actorUserId: input.actorUserId ?? null,
        targetUserId: input.targetUserId ?? null,
        metadata: input.metadata ?? {},
        ipAddress: ctx.ipAddress ?? null,
        userAgent: ctx.userAgent ?? null,
        requestId: ctx.requestId ?? null,
      },
    });
  } catch (error) {
    console.error("[audit] Failed to write audit log:", error);
  }
}
