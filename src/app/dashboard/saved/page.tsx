import { redirect } from "next/navigation";
import { SavedPostsPageContent } from "@/components/dashboard/saved-posts-page-content";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getSavedPostsPaginated } from "@/lib/db/post-saves";
import { parsePage } from "@/lib/pagination";

export default async function DashboardSavedPostsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const raw = await searchParams;
  const page = parsePage(typeof raw.page === "string" ? raw.page : undefined);
  const { items, total, pagination } = await getSavedPostsPaginated(
    user.id,
    page,
  );

  return (
    <SavedPostsPageContent
      posts={items}
      total={total}
      pagination={pagination}
      page={page}
    />
  );
}
