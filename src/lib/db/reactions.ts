import { PostStatus, ReactionType } from "../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  PostLikeSummary,
  TogglePostLikeResult,
} from "@/lib/types/reactions";

export class ReactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReactionError";
  }
}

async function getPublishedPostForReaction(postId: string) {
  const post = await prisma.post.findFirst({
    where: { id: postId, status: PostStatus.PUBLISHED },
    select: { id: true, slug: true, likeCount: true, status: true },
  });

  if (!post) {
    throw new ReactionError("Post not found.");
  }

  return post;
}

export async function getPostLikeSummary(
  postId: string,
  viewerId?: string | null,
): Promise<PostLikeSummary> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { likeCount: true },
  });

  if (!post) {
    return { likeCount: 0, viewerHasLiked: false };
  }

  if (!viewerId) {
    return { likeCount: post.likeCount, viewerHasLiked: false };
  }

  const existing = await prisma.reaction.findUnique({
    where: {
      postId_userId: { postId, userId: viewerId },
    },
    select: { id: true },
  });

  return {
    likeCount: post.likeCount,
    viewerHasLiked: !!existing,
  };
}

export async function getViewerLikedPostIds(
  viewerId: string,
  postIds: string[],
) {
  if (!postIds.length) return new Set<string>();

  const rows = await prisma.reaction.findMany({
    where: {
      userId: viewerId,
      postId: { in: postIds },
    },
    select: { postId: true },
  });

  return new Set(rows.map((row) => row.postId));
}

export async function togglePostLike(
  postId: string,
  userId: string,
): Promise<TogglePostLikeResult> {
  await getPublishedPostForReaction(postId);

  const existing = await prisma.reaction.findUnique({
    where: {
      postId_userId: { postId, userId },
    },
    select: { id: true },
  });

  if (existing) {
    const updated = await prisma.$transaction(async (tx) => {
      await tx.reaction.delete({ where: { id: existing.id } });

      return tx.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
        select: { likeCount: true },
      });
    });

    return {
      liked: false,
      likeCount: Math.max(0, updated.likeCount),
    };
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.reaction.create({
      data: {
        postId,
        userId,
        type: ReactionType.LIKE,
      },
    });

    return tx.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
      select: { likeCount: true },
    });
  });

  return {
    liked: true,
    likeCount: updated.likeCount,
  };
}
