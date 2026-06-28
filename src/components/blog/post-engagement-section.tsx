import { PostLikeButton } from "@/components/blog/post-like-button";
import { PostSaveButton } from "@/components/blog/post-save-button";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { canReactToPost, canSavePost } from "@/lib/auth/permissions";
import { getPostLikeSummary } from "@/lib/db/reactions";
import { getPostSaveSummary } from "@/lib/db/post-saves";
import { PostStatus } from "../../../generated/prisma/client";

type PostEngagementSectionProps = {
  postId: string;
  postSlug: string;
};

export async function PostEngagementSection({
  postId,
  postSlug,
}: PostEngagementSectionProps) {
  const viewer = await getCurrentUser();

  const [likeSummary, saveSummary] = await Promise.all([
    getPostLikeSummary(postId, viewer?.id),
    getPostSaveSummary(postId, viewer?.id),
  ]);

  const published = { status: PostStatus.PUBLISHED };

  return (
    <section className="flex flex-col gap-4 border-y border-border py-6 sm:flex-row sm:items-center sm:justify-between">
      <PostLikeButton
        postId={postId}
        postSlug={postSlug}
        initialLikeCount={likeSummary.likeCount}
        initialLiked={likeSummary.viewerHasLiked}
        isSignedIn={!!viewer}
        canReact={canReactToPost(viewer, published)}
      />

      <PostSaveButton
        postId={postId}
        postSlug={postSlug}
        initialSaved={saveSummary.saved}
        isSignedIn={!!viewer}
        canSave={canSavePost(viewer, published)}
      />
    </section>
  );
}
