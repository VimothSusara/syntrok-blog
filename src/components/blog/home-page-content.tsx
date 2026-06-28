import { HomePostsSection } from "@/components/blog/home-posts-section";
import type { HomePostListItem } from "@/lib/types/home-posts";

type HomePageContentProps = {
  trending: HomePostListItem[];
  recent: HomePostListItem[];
};

export function HomePageContent({ trending, recent }: HomePageContentProps) {
  const hasAnyPosts = trending.length > 0 || recent.length > 0;

  if (!hasAnyPosts) {
    return (
      <section className="rounded-xl border border-border bg-muted/20 px-6 py-10 text-center">
        <h2 className="text-lg font-semibold">No published posts yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Check back soon — authors are getting started.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-12">
      <HomePostsSection
        title="Trending"
        description="Most liked articles from the community."
        viewAllHref="/posts?sort=popular"
        viewAllLabel="See popular posts"
        posts={trending}
        emptyMessage="No trending posts yet. Like articles to see them here."
      />

      <HomePostsSection
        title="Latest"
        description="Fresh reads, newest first."
        viewAllHref="/posts"
        viewAllLabel="Browse all posts"
        posts={recent}
        emptyMessage="No recent posts to show."
      />
    </div>
  );
}
