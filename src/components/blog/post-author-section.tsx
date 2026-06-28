import { PostAuthorMeta } from "@/components/blog/post-author-meta";
import { FollowAuthorButton } from "@/components/blog/follow-author-button";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { canFollowUser } from "@/lib/auth/permissions";
import { isFollowing } from "@/lib/db/follows";

type PostAuthorSectionProps = {
  author: {
    id: string;
    username: string | null;
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
  publishedAt: Date | null;
};

export async function PostAuthorSection({
  author,
  publishedAt,
}: PostAuthorSectionProps) {
  const viewer = (await getCurrentUser()) ?? null;

  const showFollow = canFollowUser(viewer, {
    id: author.id,
    status: "ACTIVE",
    username: author.username,
  });

  const following =
    showFollow && viewer ? await isFollowing(viewer.id, author.id) : false;

  const followButton =
    showFollow && author.username ? (
      <FollowAuthorButton
        targetUserId={author.id}
        username={author.username}
        initialFollowing={following}
        isSignedIn={!!viewer}
        size="sm"
      />
    ) : null;

  return (
    <PostAuthorMeta
      author={author}
      publishedAt={publishedAt}
      actions={followButton}
    />
  );
}
