import { prisma } from "@/lib/prisma";

const actorSelect = {
  id: true,
  name: true,
  email: true,
} as const;

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
