import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PostCard } from "@/components/blog/post-card";
import { PostGrid, PostGridItem } from "@/components/blog/post-grid";
import type { HomePostListItem } from "@/lib/types/home-posts";
import { Button } from "@/components/ui/button";

type HomePostsSectionProps = {
  title: string;
  description?: string;
  viewAllHref: string;
  viewAllLabel?: string;
  posts: HomePostListItem[];
  emptyMessage?: string;
};

export function HomePostsSection({
  title,
  description,
  viewAllHref,
  viewAllLabel = "View all",
  posts,
  emptyMessage = "No posts yet.",
}: HomePostsSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        {posts.length > 0 ? (
          <Button variant="ghost" size="sm" asChild className="gap-1.5">
            <Link href={viewAllHref}>
              {viewAllLabel}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        ) : null}
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <PostGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {posts.map((post) => (
            <PostGridItem key={post.id}>
              <PostCard post={post} />
            </PostGridItem>
          ))}
        </PostGrid>
      )}
    </section>
  );
}
