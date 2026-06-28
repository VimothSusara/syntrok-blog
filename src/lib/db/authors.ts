import { PostStatus, UserStatus } from "../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { publicAuthorSelect } from "@/lib/db/selects/public-author";
import {
  buildPaginationMeta,
  DEFAULT_PAGE_SIZE,
  getSkip,
  parsePage,
} from "@/lib/pagination";

const publicPostListInclude = {
  author: { select: publicAuthorSelect },
  category: { select: { id: true, name: true, slug: true } },
  tags: {
    include: { tag: { select: { id: true, name: true, slug: true } } },
  },
} as const;

export async function getPublishedAuthors() {
  return prisma.user.findMany({
    where: {
      status: UserStatus.ACTIVE,
      username: { not: null },
      posts: { some: { status: PostStatus.PUBLISHED } },
    },
    select: {
      ...publicAuthorSelect,
      _count: {
        select: { posts: { where: { status: PostStatus.PUBLISHED } } },
      },
    },
    orderBy: [{ name: "asc" }, { email: "asc" }],
  });
}

export async function getPublicAuthorByUsername(username: string) {
  return prisma.user.findFirst({
    where: {
      username,
      status: UserStatus.ACTIVE,
    },
    select: {
      ...publicAuthorSelect,
      createdAt: true,
      _count: {
        select: {
          posts: { where: { status: PostStatus.PUBLISHED } },
          followers: true,
          following: true,
        },
      },
    },
  });
}

export async function getPublishedPostsByAuthorPaginated(
  authorId: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const where = {
    authorId,
    status: PostStatus.PUBLISHED,
  };

  const skip = getSkip(page, pageSize);

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: pageSize,
      include: publicPostListInclude,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    items,
    total,
    pagination: buildPaginationMeta(page, pageSize, total),
  };
}

export function parseAuthorPage(
  raw: Record<string, string | string[] | undefined>,
) {
  return parsePage(typeof raw.page === "string" ? raw.page : undefined);
}
