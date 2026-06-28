"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PostCard } from "@/components/blog/post-card";
import { PostGrid, PostGridItem } from "@/components/blog/post-grid";
import { PostFiltersSheet } from "@/components/blog/post-filters-sheet";
import { PostFollowingToggle } from "@/components/blog/post-following-toggle";
import { ActiveFilterBadges } from "@/components/blog/active-filter-badges";
import { Pagination } from "@/components/shared/pagination";
import {
  publicFiltersToParams,
  type PublicPostFilters,
  publicPostSortLabels,
} from "@/lib/search-params/public-posts";
import { buildQueryString } from "@/lib/urls/search-params";
import type { PaginationMeta } from "@/lib/pagination";
import type { PostFilterOptions } from "@/lib/db/post-filter-options";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { PostSortSelect } from "@/components/blog/post-sort-select";
import { PageHeader } from "@/components/shared/page-header";
import { publicBreadcrumbs } from "@/lib/breadcrumbs";

type PostListItem = React.ComponentProps<typeof PostCard>["post"] & {
  id: string;
};

type PostsPageContentProps = {
  posts: PostListItem[];
  total: number;
  pagination: PaginationMeta;
  filters: PublicPostFilters;
  options: PostFilterOptions;
  isSignedIn: boolean;
};

function buildPostsDescription(
  filters: PublicPostFilters,
  total: number,
  isSignedIn: boolean,
) {
  if (filters.following) {
    if (!isSignedIn) {
      return "Sign in to see posts from authors you follow.";
    }
    if (total === 0) {
      return "No posts from authors you follow yet.";
    }
    return `${total} post${total === 1 ? "" : "s"} from authors you follow${
      filters.sort !== "latest"
        ? ` · sorted by ${publicPostSortLabels[filters.sort].toLowerCase()}`
        : ""
    }`;
  }

  if (total === 0) {
    return "No posts match your filters.";
  }

  return `${total} published ${total === 1 ? "post" : "posts"}${
    filters.sort !== "latest"
      ? ` · sorted by ${publicPostSortLabels[filters.sort].toLowerCase()}`
      : ""
  }`;
}

function buildEmptyMessage(filters: PublicPostFilters, isSignedIn: boolean) {
  if (filters.following) {
    if (!isSignedIn) {
      return (
        <>
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>{" "}
          to view your following feed.
        </>
      );
    }

    return (
      <>
        Follow authors from their profile pages, then check back here.{" "}
        <Link
          href="/posts"
          className="font-medium text-primary hover:underline"
        >
          Browse all posts
        </Link>
        .
      </>
    );
  }

  return "Try adjusting your filters.";
}

export function PostsPageContent({
  posts,
  total,
  pagination,
  filters,
  options,
  isSignedIn,
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
      <PageHeader
        variant="public"
        breadcrumbs={publicBreadcrumbs.posts()}
        title={filters.following ? "Following" : "Posts"}
        description={buildPostsDescription(filters, total, isSignedIn)}
      />

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

        <div className="flex flex-wrap items-center gap-2">
          <PostFollowingToggle
            filters={filters}
            isSignedIn={isSignedIn}
            disabled={isPending}
            onChange={navigate}
          />
          <PostSortSelect
            filters={filters}
            onChange={navigate}
            disabled={isPending}
          />
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
          <p className="text-muted-foreground">
            {buildEmptyMessage(filters, isSignedIn)}
          </p>
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
