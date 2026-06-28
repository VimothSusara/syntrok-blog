import { cache } from "react";
import { getActiveCategories } from "@/lib/db/categories";
import { getActiveTags } from "@/lib/db/tags";
import { getPublishedAuthors } from "@/lib/db/authors";

export const getPostFilterOptions = cache(async () => {
  const [categories, tags, authors] = await Promise.all([
    getActiveCategories(),
    getActiveTags(),
    getPublishedAuthors(),
  ]);

  return {
    categories: categories.map((c) => ({
      slug: c.slug,
      name: c.name,
    })),
    tags: tags.map((t) => ({
      slug: t.slug,
      name: t.name,
    })),
    authors: authors.map((a) => ({
      id: a.id,
      username: a.username!,
      name: a.name,
      email: a.email,
      imageUrl: a.imageUrl,
      bio: a.bio,
      publishedCount: a._count.posts,
    })),
  };
});

export type PostFilterOptions = Awaited<
  ReturnType<typeof getPostFilterOptions>
>;
