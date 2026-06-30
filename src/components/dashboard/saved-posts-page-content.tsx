import { PostCard } from "@/components/blog/post-card";
import { PostGrid, PostGridItem } from "@/components/blog/post-grid";
import { Pagination } from "@/components/shared/pagination";
import type { PaginationMeta } from "@/lib/pagination";
import { PageHeader } from "@/components/shared/page-header";
import { dashboardBreadcrumbs } from "@/lib/breadcrumbs";

type SavedPost = React.ComponentProps<typeof PostCard>["post"] & {
  id: string;
};

type SavedPostsPageContentProps = {
  posts: SavedPost[];
  total: number;
  pagination: PaginationMeta;
  page: number;
};

export function SavedPostsPageContent({
  posts,
  total,
  pagination,
  page,
}: SavedPostsPageContentProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={dashboardBreadcrumbs.saved()}
        title="Saved posts"
        description={
          total === 0
            ? "Posts you bookmark will appear here."
            : `${total} saved ${total === 1 ? "post" : "posts"}`
        }
      />

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Browse{" "}
          <a href="/posts" className="font-medium text-primary hover:underline">
            published posts
          </a>{" "}
          and tap Save on any article.
        </p>
      ) : (
        <>
          <PostGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {posts.map((post) => (
              <PostGridItem key={post.id}>
                <PostCard post={post} />
              </PostGridItem>
            ))}
          </PostGrid>

          <Pagination
            basePath="/dashboard/saved"
            pagination={pagination}
            params={page > 1 ? { page: String(page) } : {}}
          />
        </>
      )}
    </div>
  );
}
