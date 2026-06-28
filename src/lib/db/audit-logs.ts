import type { Prisma } from "../../../generated/prisma/client";
import { AuditAction, AuditEntityType } from "../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { buildPaginationMeta, getSkip } from "@/lib/pagination";
import type { AuditAdminFilters } from "@/lib/search-params/audit-admin";

const actorSelect = {
  id: true,
  name: true,
  email: true,
} as const;

function buildAuditLogWhere(
  filters: AuditAdminFilters,
): Prisma.AuditLogWhereInput {
  const where: Prisma.AuditLogWhereInput = {};

  if (filters.q) {
    where.OR = [
      { entityId: { contains: filters.q, mode: "insensitive" } },
      { actor: { email: { contains: filters.q, mode: "insensitive" } } },
      { actor: { name: { contains: filters.q, mode: "insensitive" } } },
      { targetUser: { email: { contains: filters.q, mode: "insensitive" } } },
      { targetUser: { name: { contains: filters.q, mode: "insensitive" } } },
    ];
  }

  if (filters.action !== "all") {
    where.action = filters.action as AuditAction;
  }

  if (filters.entity !== "all") {
    where.entityType = filters.entity as AuditEntityType;
  }

  return where;
}

export async function getAuditLogsPaginated(filters: AuditAdminFilters) {
  const where = buildAuditLogWhere(filters);
  const skip = getSkip(filters.page, filters.pageSize);

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: filters.pageSize,
      include: {
        actor: { select: actorSelect },
        targetUser: { select: actorSelect },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    items,
    total,
    pagination: buildPaginationMeta(filters.page, filters.pageSize, total),
  };
}

/** @deprecated Use getAuditLogsPaginated */
export async function getRecentAuditLogs(limit = 100) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      actor: { select: actorSelect },
      targetUser: { select: actorSelect },
    },
  });
}
