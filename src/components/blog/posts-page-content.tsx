"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PostCard } from "@/components/blog/post-card";
import { PostGrid, PostGridItem } from "@/components/blog/post-grid";
import { PostFiltersSheet } from "@/components/blog/post-filters-sheet";
import { ActiveFilterBadges } from "@/components/blog/active-filter-badges";
import { Pagination } from "@/components/shared/pagination";
import {
  publicFiltersToParams,
  type PublicPostFilters,
} from "@/lib/search-params/public-posts";
import { buildQueryString } from "@/lib/urls/search-params";
import type { PaginationMeta } from "@/lib/pagination";
import type { PostFilterOptions } from "@/lib/db/post-filter-options";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type PostListItem = React.ComponentProps<typeof PostCard>["post"] & {
  id: string;
};

type PostsPageContentProps = {
  posts: PostListItem[];
  total: number;
  pagination: PaginationMeta;
  filters: PublicPostFilters;
  options: PostFilterOptions;
};

export function PostsPageContent({
  posts,
  total,
  pagination,
  filters,
  options,
}: PostsPageContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const activeCount =
    filters.categories.length +
    filters.tags.length +
    filters.authors.length +
    (filters.from ? 1 : 0) +
    (filters.to ? 1 : 0);

  const navigate = (next: PublicPostFilters) => {
    startTransition(() => {
      router.push(`/posts${buildQueryString(publicFiltersToParams(next))}`);
    });
  };

  const listParams = publicFiltersToParams({ ...filters, page: 1 });

  return (
    <div className="space-y-6">
      <header className="space-y-2 border-b border-border pb-6">
        <p className="text-sm font-medium tracking-wide text-primary uppercase">
          Articles
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Posts
        </h1>
        <p className="text-muted-foreground">
          {total === 0
            ? "No posts match your filters."
            : `${total} published ${total === 1 ? "post" : "posts"}`}
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          className="flex flex-1 gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            navigate({
              ...filters,
              q: String(fd.get("q") ?? "").trim() || undefined,
              page: 1,
            });
          }}
        >
          <Input
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="Search posts…"
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <PostFiltersSheet
            filters={filters}
            options={options}
            activeCount={activeCount}
            onApply={navigate}
          />
          {isPending && <Spinner className="size-4" />}
        </div>
      </div>

      <ActiveFilterBadges
        filters={filters}
        options={options}
        onChange={navigate}
      />

      <div
        className={cn(
          "space-y-6 transition-opacity",
          isPending && "pointer-events-none opacity-50",
        )}
        aria-busy={isPending}
      >
        {posts.length === 0 ? (
          <p className="text-muted-foreground">Try adjusting your filters.</p>
        ) : (
          <PostGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {posts.map((post) => (
              <PostGridItem key={post.id}>
                <PostCard post={post} />
              </PostGridItem>
            ))}
          </PostGrid>
        )}

        <Pagination
          basePath="/posts"
          pagination={pagination}
          params={listParams}
        />
      </div>
    </div>
  );
}
