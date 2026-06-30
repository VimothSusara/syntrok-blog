import {
  CommentStatus,
  PostStatus,
  ReportStatus,
  ReportTargetType,
  type Prisma,
} from "../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { buildPaginationMeta, getSkip } from "@/lib/pagination";
import type { ReportAdminFilters } from "@/lib/search-params/report-admin";
import type { ReportAdminRow } from "@/lib/types/report-admin";

export class ReportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReportError";
  }
}

const reporterSelect = {
  id: true,
  name: true,
  email: true,
  username: true,
} as const;

async function resolveTargetSummary(
  targetType: ReportTargetType,
  targetId: string,
) {
  if (targetType === ReportTargetType.COMMENT) {
    const comment = await prisma.comment.findUnique({
      where: { id: targetId },
      select: {
        content: true,
        post: { select: { slug: true, title: true } },
      },
    });
    if (!comment) return { summary: "Comment not found", href: null };
    return {
      summary: comment.content.slice(0, 120),
      href: `/posts/${comment.post.slug}#comment-${targetId}`,
    };
  }

  if (targetType === ReportTargetType.POST) {
    const post = await prisma.post.findUnique({
      where: { id: targetId },
      select: { title: true, slug: true },
    });
    if (!post) return { summary: "Post not found", href: null };
    return {
      summary: post.title,
      href: `/posts/${post.slug}`,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: targetId },
    select: { name: true, email: true, username: true },
  });
  if (!user) return { summary: "User not found", href: null };
  const label = user.name ?? user.email;
  return {
    summary: label,
    href: user.username ? `/authors/${user.username}` : null,
  };
}

export async function createCommentReport(input: {
  commentId: string;
  postId: string;
  reporterId: string;
  reason: string;
}) {
  const comment = await prisma.comment.findFirst({
    where: {
      id: input.commentId,
      postId: input.postId,
      status: CommentStatus.APPROVED,
    },
    select: { id: true, userId: true },
  });

  if (!comment) {
    throw new ReportError("Comment not found.");
  }

  if (comment.userId === input.reporterId) {
    throw new ReportError("You cannot report your own comment.");
  }

  const existingOpen = await prisma.report.findFirst({
    where: {
      reporterId: input.reporterId,
      targetType: ReportTargetType.COMMENT,
      targetId: input.commentId,
      status: ReportStatus.OPEN,
    },
    select: { id: true },
  });

  if (existingOpen) {
    throw new ReportError("You already reported this comment.");
  }

  return prisma.report.create({
    data: {
      targetType: ReportTargetType.COMMENT,
      targetId: input.commentId,
      reason: input.reason,
      reporterId: input.reporterId,
    },
  });
}

function buildReportAdminWhere(
  filters: ReportAdminFilters,
): Prisma.ReportWhereInput {
  const where: Prisma.ReportWhereInput = {};

  if (filters.status !== "all") {
    where.status = filters.status as ReportStatus;
  }

  if (filters.targetType !== "all") {
    where.targetType = filters.targetType as ReportTargetType;
  }

  if (filters.q) {
    where.OR = [
      { reason: { contains: filters.q, mode: "insensitive" } },
      { targetId: { contains: filters.q, mode: "insensitive" } },
      { reporter: { email: { contains: filters.q, mode: "insensitive" } } },
      { reporter: { name: { contains: filters.q, mode: "insensitive" } } },
    ];
  }

  return where;
}

export async function getReportsPaginated(filters: ReportAdminFilters) {
  const where = buildReportAdminWhere(filters);
  const skip = getSkip(filters.page, filters.pageSize);

  const [rows, total] = await Promise.all([
    prisma.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: filters.pageSize,
      include: {
        reporter: { select: reporterSelect },
      },
    }),
    prisma.report.count({ where }),
  ]);

  const items: ReportAdminRow[] = await Promise.all(
    rows.map(async (row) => {
      const target = await resolveTargetSummary(row.targetType, row.targetId);
      return {
        id: row.id,
        targetType: row.targetType,
        targetId: row.targetId,
        reason: row.reason,
        status: row.status,
        createdAt: row.createdAt,
        reviewedAt: row.reviewedAt,
        reporter: row.reporter,
        targetSummary: target.summary,
        targetHref: target.href,
      };
    }),
  );

  return {
    items,
    total,
    pagination: buildPaginationMeta(filters.page, filters.pageSize, total),
  };
}

export async function getReportForAdminAction(reportId: string) {
  return prisma.report.findUnique({
    where: { id: reportId },
    select: {
      id: true,
      status: true,
      targetType: true,
      targetId: true,
    },
  });
}

export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
) {
  return prisma.report.update({
    where: { id: reportId },
    data: {
      status,
      reviewedAt: new Date(),
    },
    select: { id: true, status: true, targetType: true, targetId: true },
  });
}

export async function getOpenCommentReportIdsForPost(
  postId: string,
  reporterId: string,
): Promise<string[]> {
  const comments = await prisma.comment.findMany({
    where: { postId },
    select: { id: true },
  });

  if (!comments.length) return [];

  const reports = await prisma.report.findMany({
    where: {
      reporterId,
      targetType: ReportTargetType.COMMENT,
      targetId: { in: comments.map((c) => c.id) },
      status: ReportStatus.OPEN,
    },
    select: { targetId: true },
  });

  return reports.map((r) => r.targetId);
}
