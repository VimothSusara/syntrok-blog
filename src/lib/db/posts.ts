import { PostStatus, type Prisma } from "../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { endOfUtcDay, startOfUtcDay } from "@/lib/date";
import {
  buildPaginationMeta,
  getSkip,
  type PaginationMeta,
} from "@/lib/pagination";
import type { PublicPostFilters } from "@/lib/search-params/public-posts";
import type { DashboardPostFilters } from "@/lib/search-params/dashboard-posts";
import { tiptapJsonToPlainText } from "@/lib/posts/content";
import type { PostFormInput } from "@/lib/validations/post";
import { publicAuthorSelect } from "./selects/public-author";

const publicPostInclude = {
  author: { select: publicAuthorSelect },
  category: { select: { id: true, name: true, slug: true } },
  tags: {
    include: { tag: { select: { id: true, name: true, slug: true } } },
  },
} as const;

function buildPublishedWhere(
  filters: PublicPostFilters,
  followedAuthorIds?: string[] | null,
): Prisma.PostWhereInput {
  const where: Prisma.PostWhereInput = { status: PostStatus.PUBLISHED };

  if (filters.following) {
    const ids = followedAuthorIds ?? [];
    where.authorId = ids.length > 0 ? { in: ids } : { in: [] };
  }

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { summary: { contains: filters.q, mode: "insensitive" } },
      { contentPlain: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  if (filters.categories.length) {
    where.category = {
      slug: { in: filters.categories },
      isActive: true,
    };
  }

  if (filters.tags.length) {
    where.tags = {
      some: {
        tag: { slug: { in: filters.tags }, isActive: true },
      },
    };
  }

  if (filters.authors.length) {
    where.author = {
      OR: [
        { username: { in: filters.authors } },
        { id: { in: filters.authors } },
      ],
    };
  }

  if (filters.from || filters.to) {
    where.publishedAt = {
      ...(filters.from && { gte: startOfUtcDay(filters.from) }),
      ...(filters.to && { lte: endOfUtcDay(filters.to) }),
    };
  }

  return where;
}

function buildPublishedOrderBy(
  sort: PublicPostFilters["sort"],
): Prisma.PostOrderByWithRelationInput[] {
  switch (sort) {
    case "popular":
      return [{ likeCount: "desc" }, { publishedAt: "desc" }];
    case "views":
      return [{ viewCount: "desc" }, { publishedAt: "desc" }];
    case "latest":
    default:
      return [{ publishedAt: "desc" }];
  }
}

type PublishedPostsQueryOptions = {
  followedAuthorIds?: string[] | null;
};

export async function getPublishedPostsPaginated(
  filters: PublicPostFilters,
  options?: PublishedPostsQueryOptions,
) {
  const followedAuthorIds = filters.following
    ? (options?.followedAuthorIds ?? [])
    : undefined;

  const where = buildPublishedWhere(filters, followedAuthorIds);
  const skip = getSkip(filters.page, filters.pageSize);
  const orderBy = buildPublishedOrderBy(filters.sort);

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy,
      skip,
      take: filters.pageSize,
      include: publicPostInclude,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    items,
    total,
    pagination: buildPaginationMeta(filters.page, filters.pageSize, total),
  };
}

export async function getTrendingPublishedPosts(limit = 6) {
  return prisma.post.findMany({
    where: { status: PostStatus.PUBLISHED },
    orderBy: [{ likeCount: "desc" }, { publishedAt: "desc" }],
    take: limit,
    include: publicPostInclude,
  });
}

export async function getRecentPublishedPosts(
  limit = 6,
  excludeIds: string[] = [],
) {
  return prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
      ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: publicPostInclude,
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: { slug, status: PostStatus.PUBLISHED },
    include: publicPostInclude,
  });
}

export async function getPostsByAuthorPaginated(
  authorId: string,
  filters: DashboardPostFilters,
) {
  const where: Prisma.PostWhereInput = {
    authorId,
    status: { not: PostStatus.DELETED },
  };

  if (filters.status !== "ALL") {
    where.status = filters.status;
  }

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { slug: { contains: filters.q, mode: "insensitive" } },
      { summary: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  const skip = getSkip(filters.page, filters.pageSize);

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: filters.pageSize,
      include: { category: { select: { name: true } } },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    items,
    total,
    pagination: buildPaginationMeta(filters.page, filters.pageSize, total),
  };
}

export async function getPostById(postId: string) {
  return prisma.post.findUnique({
    where: { id: postId },
    include: { tags: { select: { tagId: true } } },
  });
}

export async function isSlugTaken(slug: string, excludePostId?: string) {
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (!existing) return false;
  if (excludePostId && existing.id === excludePostId) return false;
  return true;
}

export async function createPost(authorId: string, input: PostFormInput) {
  const contentPlain = tiptapJsonToPlainText(input.content);
  const publishedAt = input.status === "PUBLISHED" ? new Date() : null;
  const tagIds = input.tagIds ?? [];

  return prisma.post.create({
    data: {
      title: input.title.trim(),
      slug: input.slug,
      summary: input.summary?.trim() || null,
      content: input.content,
      contentPlain,
      coverImageUrl: input.coverImageUrl?.trim() || null,
      coverImagePublicId: input.coverImagePublicId?.trim() || null,
      status: input.status as PostStatus,
      publishedAt,
      authorId,
      categoryId: input.categoryId || null,
      ...(tagIds.length
        ? { tags: { create: tagIds.map((tagId) => ({ tagId })) } }
        : {}),
    },
  });
}

export async function updatePost(postId: string, input: PostFormInput) {
  const existing = await prisma.post.findUnique({ where: { id: postId } });
  if (!existing) return null;

  const contentPlain = tiptapJsonToPlainText(input.content);
  const publishedAt =
    input.status === "PUBLISHED"
      ? (existing.publishedAt ?? new Date())
      : input.status === "DRAFT"
        ? null
        : existing.publishedAt;

  const tagIds = input.tagIds ?? [];

  return prisma.$transaction(async (tx) => {
    await tx.postTag.deleteMany({ where: { postId } });

    return tx.post.update({
      where: { id: postId },
      data: {
        title: input.title.trim(),
        slug: input.slug,
        summary: input.summary?.trim() || null,
        content: input.content,
        contentPlain,
        coverImageUrl: input.coverImageUrl?.trim() || null,
        coverImagePublicId: input.coverImagePublicId?.trim() || null,
        status: input.status as PostStatus,
        publishedAt,
        categoryId: input.categoryId || null,
        ...(tagIds.length
          ? { tags: { create: tagIds.map((tagId) => ({ tagId })) } }
          : {}),
      },
    });
  });
}

export async function softDeletePost(postId: string) {
  return prisma.post.update({
    where: { id: postId },
    data: { status: PostStatus.DELETED },
  });
}

export async function incrementPostViewCount(postId: string) {
  return prisma.post.update({
    where: { id: postId },
    data: { viewCount: { increment: 1 } },
  });
}

export async function updatePostStatus(postId: string, status: PostStatus) {
  const existing = await prisma.post.findUnique({ where: { id: postId } });
  if (!existing) return null;

  let publishedAt = existing.publishedAt;

  if (status === PostStatus.PUBLISHED) {
    publishedAt = existing.publishedAt ?? new Date();
  } else if (status === PostStatus.DRAFT) {
    publishedAt = null;
  }

  return prisma.post.update({
    where: { id: postId },
    data: { status, publishedAt },
  });
}

export type { PaginationMeta };

export type PublicPostListItem = Awaited<
  ReturnType<typeof getTrendingPublishedPosts>
>[number];
