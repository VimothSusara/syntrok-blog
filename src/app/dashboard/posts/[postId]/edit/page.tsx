import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { canEditPost } from "@/lib/auth/permissions";
import { getActiveCategories } from "@/lib/db/categories";
import { getActiveTags } from "@/lib/db/tags";
import { getPostById } from "@/lib/db/posts";
import { PostForm } from "@/components/dashboard/post-form";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { dashboardBreadcrumbs } from "@/lib/breadcrumbs";
import { isSuperAdmin } from "@/lib/auth/permissions";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const user = await getCurrentUser();

  const [post, categories, tags] = await Promise.all([
    getPostById(postId),
    getActiveCategories(),
    getActiveTags(),
  ]);

  if (!user || !post || !canEditPost(user, post)) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        breadcrumbs={dashboardBreadcrumbs.editPost(post.title)}
        title="Edit post"
        actions={
          post.status === "PUBLISHED" ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/posts/${post.slug}`} target="_blank">
                View live
              </Link>
            </Button>
          ) : undefined
        }
      />

      <PostForm
        mode="edit"
        post={post}
        userId={user.id}
        canManageTaxonomy={isSuperAdmin(user)}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}
