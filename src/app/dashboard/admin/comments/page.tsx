import { getCommentsPaginated } from "@/lib/db/comments";
import { parseCommentAdminFilters } from "@/lib/search-params/comment-admin";
import { CommentsAdminPageContent } from "@/components/dashboard/admin/comments-admin-page-content";

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const filters = parseCommentAdminFilters(raw);
  const { items, total, pagination } = await getCommentsPaginated(filters);

  return (
    <CommentsAdminPageContent
      rows={items}
      total={total}
      pagination={pagination}
      filters={filters}
    />
  );
}
