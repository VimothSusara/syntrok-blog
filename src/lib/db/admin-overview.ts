import {
  CommentStatus,
  PostStatus,
  ReportStatus,
  UserStatus,
} from "../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  AdminOverviewAuditRow,
  AdminOverviewStats,
} from "@/lib/types/admin-overview";

const actorSelect = {
  id: true,
  name: true,
  email: true,
} as const;

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const [
    usersTotal,
    usersActive,
    usersSuspended,
    usersBanned,
    postsPublished,
    postsDraft,
    commentsTotal,
    commentsHidden,
    categoriesTotal,
    tagsTotal,
    reportsOpen,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
    prisma.user.count({ where: { status: UserStatus.SUSPENDED } }),
    prisma.user.count({ where: { status: UserStatus.BANNED } }),
    prisma.post.count({ where: { status: PostStatus.PUBLISHED } }),
    prisma.post.count({ where: { status: PostStatus.DRAFT } }),
    prisma.comment.count(),
    prisma.comment.count({
      where: {
        status: {
          in: [
            CommentStatus.REJECTED,
            CommentStatus.SPAM,
            CommentStatus.DELETED,
          ],
        },
      },
    }),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.report.count({ where: { status: ReportStatus.OPEN } }),
  ]);

  return {
    users: {
      total: usersTotal,
      active: usersActive,
      suspended: usersSuspended,
      banned: usersBanned,
    },
    posts: {
      published: postsPublished,
      draft: postsDraft,
    },
    comments: {
      total: commentsTotal,
      hidden: commentsHidden,
    },
    taxonomy: {
      categories: categoriesTotal,
      tags: tagsTotal,
    },
    reports: {
      open: reportsOpen,
    },
  };
}

export async function getAdminOverviewRecentAuditLogs(
  limit = 5,
): Promise<AdminOverviewAuditRow[]> {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      action: true,
      entityType: true,
      entityId: true,
      createdAt: true,
      actor: { select: actorSelect },
    },
  });
}
