import type { Metadata } from "next";
import { HomeHero } from "@/components/blog/home-hero";
import { siteConfig } from "@/config/site";
import {
  getRecentPublishedPosts,
  getTrendingPublishedPosts,
} from "@/lib/db/posts";
import { HomePostsSection } from "@/components/blog/home-posts-section";
import { Suspense } from "react";
import { HomePostsSectionSkeleton } from "@/components/blog/home-page-skeleton";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

const HOME_SECTION_LIMIT = 6;

async function TrendingPostsSection() {
  const posts = await getTrendingPublishedPosts(HOME_SECTION_LIMIT);

  return (
    <HomePostsSection
      title="Trending"
      description="Most liked articles from the community."
      viewAllHref="/posts?sort=popular"
      viewAllLabel="See popular posts"
      posts={posts}
      emptyMessage="No trending posts yet. Like articles to see them here."
    />
  );
}

async function LatestPostsSection() {
  const posts = await getRecentPublishedPosts(HOME_SECTION_LIMIT);

  return (
    <HomePostsSection
      title="Latest"
      description="Fresh reads, newest first."
      viewAllHref="/posts"
      viewAllLabel="Browse all posts"
      posts={posts}
      emptyMessage="No recent posts to show."
    />
  );
}

export default function HomePage() {
  return (
    <div className="space-y-12">
      <HomeHero />

      <Suspense
        fallback={
          <HomePostsSectionSkeleton
            title="Trending"
            description="Most liked articles from the community."
          />
        }
      >
        <TrendingPostsSection />
      </Suspense>

      <Suspense
        fallback={
          <HomePostsSectionSkeleton
            title="Latest"
            description="Fresh reads, newest first."
          />
        }
      >
        <LatestPostsSection />
      </Suspense>
    </div>
  );
}
