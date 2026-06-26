import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getActiveCategories } from "@/lib/db/categories";
import { getActiveTags } from "@/lib/db/tags";
import { PostForm } from "@/components/dashboard/post-form";

export default async function NewPostPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [categories, tags] = await Promise.all([
    getActiveCategories(),
    getActiveTags(),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">New post</h1>
      <PostForm
        mode="create"
        userId={user.id}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}
