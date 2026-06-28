import { UserStatus } from "../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";

export class FollowError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FollowError";
  }
}

async function assertFollowableTarget(followingId: string) {
  const target = await prisma.user.findFirst({
    where: {
      id: followingId,
      status: UserStatus.ACTIVE,
      username: { not: null },
    },
    select: { id: true, username: true },
  });

  if (!target) {
    throw new FollowError("Author not found.");
  }

  return target;
}

export async function isFollowing(followerId: string, followingId: string) {
  if (followerId === followingId) return false;

  const row = await prisma.userFollow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId },
    },
    select: { followerId: true },
  });

  return !!row;
}

export async function getFollowCounts(userId: string) {
  const [followers, following] = await Promise.all([
    prisma.userFollow.count({ where: { followingId: userId } }),
    prisma.userFollow.count({ where: { followerId: userId } }),
  ]);

  return { followers, following };
}

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) {
    throw new FollowError("You cannot follow yourself.");
  }

  await assertFollowableTarget(followingId);

  await prisma.userFollow.upsert({
    where: {
      followerId_followingId: { followerId, followingId },
    },
    create: { followerId, followingId },
    update: {},
  });
}

export async function unfollowUser(followerId: string, followingId: string) {
  await prisma.userFollow.deleteMany({
    where: { followerId, followingId },
  });
}

export async function getFollowedAuthorIds(followerId: string) {
  const rows = await prisma.userFollow.findMany({
    where: { followerId },
    select: { followingId: true },
  });

  return rows.map((row) => row.followingId);
}

export async function toggleFollow(followerId: string, followingId: string) {
  const existing = await prisma.userFollow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  });

  if (existing) {
    await unfollowUser(followerId, followingId);
    return { following: false as const };
  }

  await followUser(followerId, followingId);
  return { following: true as const };
}
