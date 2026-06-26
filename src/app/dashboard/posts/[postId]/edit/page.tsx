import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { canEditPost } from "@/lib/auth/permissions";
import { getActiveCategories } from "@/lib/db/categories";
import { getActiveTags } from "@/lib/db/tags";
import { getPostById } from "@/lib/db/posts";
import { PostForm } from "@/components/dashboard/post-form";
import { Button } from "@/components/ui/button";

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Edit post</h1>
        {post.status === "PUBLISHED" && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/posts/${post.slug}`} target="_blank">
              View live
            </Link>
          </Button>
        )}
      </div>
      <PostForm
        mode="edit"
        post={post}
        userId={user.id}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}
