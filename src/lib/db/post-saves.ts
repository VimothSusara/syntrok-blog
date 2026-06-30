import { PostStatus, type Prisma } from "../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  buildPaginationMeta,
  DEFAULT_PAGE_SIZE,
  getSkip,
} from "@/lib/pagination";
import { publicAuthorSelect } from "@/lib/db/selects/public-author";
import type { TogglePostSaveResult } from "@/lib/types/post-saves";

export class PostSaveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PostSaveError";
  }
}

const savedPostInclude = {
  author: { select: publicAuthorSelect },
  category: { select: { id: true, name: true, slug: true } },
  tags: {
    include: { tag: { select: { id: true, name: true, slug: true } } },
  },
} as const;

async function getPublishedPostForSave(postId: string) {
  const post = await prisma.post.findFirst({
    where: { id: postId, status: PostStatus.PUBLISHED },
    select: { id: true, slug: true, status: true },
  });

  if (!post) {
    throw new PostSaveError("Post not found.");
  }

  return post;
}

export async function isPostSaved(userId: string, postId: string) {
  const row = await prisma.postSave.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
    select: { userId: true },
  });

  return !!row;
}

export async function getPostSaveSummary(
  postId: string,
  viewerId?: string | null,
) {
  if (!viewerId) {
    return { saved: false };
  }

  const saved = await isPostSaved(viewerId, postId);
  return { saved };
}

export async function togglePostSave(
  postId: string,
  userId: string,
): Promise<TogglePostSaveResult> {
  await getPublishedPostForSave(postId);

  const existing = await prisma.postSave.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
    select: { userId: true },
  });

  if (existing) {
    await prisma.postSave.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });

    return { saved: false };
  }

  await prisma.postSave.create({
    data: { userId, postId },
  });

  return { saved: true };
}

export async function getSavedPostsPaginated(
  userId: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const where: Prisma.PostSaveWhereInput = {
    userId,
    post: { status: PostStatus.PUBLISHED },
  };

  const skip = getSkip(page, pageSize);

  const [rows, total] = await Promise.all([
    prisma.postSave.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        post: { include: savedPostInclude },
      },
    }),
    prisma.postSave.count({ where }),
  ]);

  return {
    items: rows.map((row) => row.post),
    total,
    pagination: buildPaginationMeta(page, pageSize, total),
  };
}
