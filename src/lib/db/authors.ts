import { PostStatus } from "../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function getPublishedAuthors() {
  return prisma.user.findMany({
    where: { posts: { some: { status: PostStatus.PUBLISHED } } },
    select: {
      id: true,
      name: true,
      email: true,
      imageUrl: true,
      bio: true,
      _count: {
        select: { posts: { where: { status: PostStatus.PUBLISHED } } },
      },
    },
    orderBy: [{ name: "asc" }, { email: "asc" }],
  });
}
