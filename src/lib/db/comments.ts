import { publicAuthorSelect } from "./selects/public-author";
import { prisma } from "@/lib/prisma";
import {
  CommentStatus,
  PostStatus,
  Prisma,
} from "../../../generated/prisma/client";
import { CommentAdminFilters } from "../search-params/comment-admin";
import { buildPaginationMeta, getSkip } from "@/lib/pagination";
import type { CommentAdminRow } from "@/lib/types/comment-admin";

const commentUserSelect = {
  id: publicAuthorSelect.id,
  username: publicAuthorSelect.username,
  name: publicAuthorSelect.name,
  email: publicAuthorSelect.email,
  imageUrl: publicAuthorSelect.imageUrl,
} as const;

export type PublicComment = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    username: string | null;
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
  replies: PublicComment[];
};

export class CommentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommentError";
  }
}

export async function getApprovedCommentsForPost(postId: string) {
  const rows = await prisma.comment.findMany({
    where: {
      postId,
      status: CommentStatus.APPROVED,
      parentId: null,
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: commentUserSelect },
      replies: {
        where: { status: CommentStatus.APPROVED },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: { select: commentUserSelect },
        },
      },
    },
  });

  return rows.map((row) => ({
    ...row,
    replies: row.replies.map((reply) => ({ ...reply, replies: [] })),
  })) satisfies PublicComment[];
}

export async function getApprovedCommentCountForPost(postId: string) {
  return prisma.comment.count({
    where: {
      postId,
      status: CommentStatus.APPROVED,
    },
  });
}

export async function createComment(input: {
  postId: string;
  userId: string;
  content: string;
  parentId?: string;
}) {
  const post = await prisma.post.findFirst({
    where: {
      id: input.postId,
      status: PostStatus.PUBLISHED,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!post) throw new CommentError("Post not found.");

  if (input.parentId) {
    const parent = await prisma.comment.findFirst({
      where: {
        id: input.parentId,
        postId: input.postId,
        status: CommentStatus.APPROVED,
        parentId: null,
      },
      select: {
        id: true,
      },
    });

    if (!parent) {
      throw new CommentError("Parent comment not found.");
    }
  }

  const comment = await prisma.comment.create({
    data: {
      postId: input.postId,
      userId: input.userId,
      content: input.content.trim(),
      parentId: input.parentId || null,
      status: CommentStatus.APPROVED,
    },
    select: {
      id: true,
      postId: true,
      status: true,
    },
  });

  return {
    comment,
    postSlug: post.slug,
  };
}

function buildCommentAdminWhere(
  filters: CommentAdminFilters,
): Prisma.CommentWhereInput {
  const where: Prisma.CommentWhereInput = {};
  if (filters.q) {
    where.OR = [
      { content: { contains: filters.q, mode: "insensitive" } },
      { user: { name: { contains: filters.q, mode: "insensitive" } } },
      { user: { email: { contains: filters.q, mode: "insensitive" } } },
      { post: { title: { contains: filters.q, mode: "insensitive" } } },
    ];
  }
  if (filters.status !== "all") {
    where.status = filters.status;
  }
  return where;
}

export async function getCommentsPaginated(filters: CommentAdminFilters) {
  const where = buildCommentAdminWhere(filters);
  const skip = getSkip(filters.page, filters.pageSize);

  const [items, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: filters.pageSize,
      select: {
        id: true,
        content: true,
        status: true,
        createdAt: true,
        parentId: true,
        user: { select: commentUserSelect },
        post: { select: { id: true, title: true, slug: true } },
      },
    }),
    prisma.comment.count({ where }),
  ]);

  return {
    items: items as CommentAdminRow[],
    total,
    pagination: buildPaginationMeta(filters.page, filters.pageSize, total),
  };
}

export async function getCommentForModeration(commentId: string) {
  return prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      id: true,
      status: true,
      postId: true,
      userId: true,
      post: { select: { slug: true, title: true } },
    },
  });
}

export async function updateCommentStatus(
  commentId: string,
  status: CommentStatus,
) {
  return prisma.comment.update({
    where: { id: commentId },
    data: { status },
    select: {
      id: true,
      status: true,
      post: { select: { slug: true } },
      userId: true,
    },
  });
}
