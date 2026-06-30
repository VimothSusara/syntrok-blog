"use client";

import Link from "next/link";
import type { Post } from "../../../generated/prisma/client";
import { PostsTable } from "@/components/dashboard/posts-table";
import { PostsTableToolbar } from "@/components/dashboard/posts-table-toolbar";
import { Pagination } from "@/components/shared/pagination";
import type { DashboardPostFilters } from "@/lib/search-params/dashboard-posts";
import { dashboardFiltersToParams } from "@/lib/search-params/dashboard-posts";
import type { PaginationMeta } from "@/lib/pagination";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { dashboardBreadcrumbs } from "@/lib/breadcrumbs";

type DashboardPostsPageContentProps = {
  posts: Post[];
  pagination: PaginationMeta;
  filters: DashboardPostFilters;
};

export function DashboardPostsPageContent({
  posts,
  pagination,
  filters,
}: DashboardPostsPageContentProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={dashboardBreadcrumbs.myPosts()}
        title="My posts"
        actions={
          <Button asChild>
            <Link href="/dashboard/posts/new">New post</Link>
          </Button>
        }
      />

      <PostsTableToolbar filters={filters} />
      <PostsTable posts={posts} />
      <Pagination
        basePath="/dashboard/posts"
        pagination={pagination}
        params={dashboardFiltersToParams({ ...filters, page: 1 })}
      />
    </div>
  );
}
