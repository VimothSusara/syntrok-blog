import { PostStatus } from "../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function getAuthorStats(authorId: string) {
  const [total, published, drafts, views] = await Promise.all([
    prisma.post.count({
      where: { authorId, status: { not: PostStatus.DELETED } },
    }),
    prisma.post.count({
      where: { authorId, status: PostStatus.PUBLISHED },
    }),
    prisma.post.count({
      where: { authorId, status: PostStatus.DRAFT },
    }),
    prisma.post.aggregate({
      where: { authorId, status: { not: PostStatus.DELETED } },
      _sum: { viewCount: true },
    }),
  ]);

  return {
    total,
    published,
    drafts,
    views: views._sum.viewCount ?? 0,
  };
}
