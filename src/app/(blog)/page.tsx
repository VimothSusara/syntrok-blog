import type { Metadata } from "next";
import { HomeHero } from "@/components/blog/home-hero";
import { HomePageContent } from "@/components/blog/home-page-content";
import { siteConfig } from "@/config/site";
import {
  getRecentPublishedPosts,
  getTrendingPublishedPosts,
} from "@/lib/db/posts";

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

export default async function HomePage() {
  const trending = await getTrendingPublishedPosts(HOME_SECTION_LIMIT);
  const trendingIds = trending.map((post) => post.id);
  const recent = await getRecentPublishedPosts(HOME_SECTION_LIMIT, trendingIds);

  return (
    <div className="space-y-12">
      <HomeHero />
      <HomePageContent trending={trending} recent={recent} />
    </div>
  );
}
