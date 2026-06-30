import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isSuperAdmin } from "@/lib/auth/permissions";
import { getActiveCategories } from "@/lib/db/categories";
import { getActiveTags } from "@/lib/db/tags";
import { PostForm } from "@/components/dashboard/post-form";
import { PageHeader } from "@/components/shared/page-header";
import { dashboardBreadcrumbs } from "@/lib/breadcrumbs";

export default async function NewPostPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [categories, tags] = await Promise.all([
    getActiveCategories(),
    getActiveTags(),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        breadcrumbs={dashboardBreadcrumbs.newPost()}
        title="New post"
      />

      <PostForm
        mode="create"
        userId={user.id}
        canManageTaxonomy={isSuperAdmin(user)}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}
