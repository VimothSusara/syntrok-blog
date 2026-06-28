import { redirect } from "next/navigation";
import { UsersAdminPageContent } from "@/components/dashboard/admin/users-admin-page-content";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isSuperAdmin } from "@/lib/auth/permissions";
import { getUsersPaginated } from "@/lib/db/users-admin";
import { parseUserAdminFilters } from "@/lib/search-params/user-admin";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!user || !isSuperAdmin(user)) redirect("/dashboard");

  const raw = await searchParams;
  const filters = parseUserAdminFilters(raw);
  const { items, total, pagination } = await getUsersPaginated(filters);

  return (
    <UsersAdminPageContent
      rows={items}
      total={total}
      pagination={pagination}
      filters={filters}
      currentUserId={user.id}
    />
  );
}
