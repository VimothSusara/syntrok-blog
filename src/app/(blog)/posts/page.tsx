import type { Metadata } from "next";
import { PostsPageContent } from "@/components/blog/posts-page-content";
import { getPostFilterOptions } from "@/lib/db/post-filter-options";
import { getPublishedPostsPaginated } from "@/lib/db/posts";
import { parsePublicPostFilters } from "@/lib/search-params/public-posts";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Posts | ${siteConfig.name}`,
  description: `Browse published articles on ${siteConfig.name}.`,
  openGraph: {
    title: `Posts | ${siteConfig.name}`,
    description: `Browse published articles on ${siteConfig.name}.`,
    type: "website",
    url: `${siteConfig.url}/posts`,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary",
    title: `Posts | ${siteConfig.name}`,
    description: `Browse published articles on ${siteConfig.name}.`,
  },
  alternates: {
    canonical: `${siteConfig.url}/posts`,
  },
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const filters = parsePublicPostFilters(raw);

  const [postsResult, options] = await Promise.all([
    getPublishedPostsPaginated(filters),
    getPostFilterOptions(),
  ]);

  return (
    <PostsPageContent
      posts={postsResult.items}
      total={postsResult.total}
      pagination={postsResult.pagination}
      filters={filters}
      options={options}
    />
  );
}
