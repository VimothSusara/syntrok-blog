import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getPostsByAuthorPaginated } from "@/lib/db/posts";
import { parseDashboardPostFilters } from "@/lib/search-params/dashboard-posts";
import { DashboardPostsPageContent } from "@/components/dashboard/posts-page-content";
import { buildPaginationMeta, DASHBOARD_PAGE_SIZE } from "@/lib/pagination";

export default async function DashboardPostsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const raw = await searchParams;
  const filters = parseDashboardPostFilters(raw);
  const { items, pagination } = await getPostsByAuthorPaginated(
    user.id,
    filters,
  );

  return (
    <DashboardPostsPageContent
      posts={items}
      pagination={pagination}
      filters={filters}
    />
  );
}
