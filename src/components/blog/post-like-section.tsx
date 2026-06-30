import { PostLikeButton } from "@/components/blog/post-like-button";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { canReactToPost } from "@/lib/auth/permissions";
import { getPostLikeSummary } from "@/lib/db/reactions";
import { PostStatus } from "../../../generated/prisma/client";

type PostLikeSectionProps = {
  postId: string;
  postSlug: string;
};

export async function PostLikeSection({
  postId,
  postSlug,
}: PostLikeSectionProps) {
  const viewer = await getCurrentUser();
  const summary = await getPostLikeSummary(postId, viewer?.id);

  return (
    <section className="border-y border-border py-6">
      <PostLikeButton
        postId={postId}
        postSlug={postSlug}
        initialLikeCount={summary.likeCount}
        initialLiked={summary.viewerHasLiked}
        isSignedIn={!!viewer}
        canReact={canReactToPost(viewer, { status: PostStatus.PUBLISHED })}
      />
    </section>
  );
}
