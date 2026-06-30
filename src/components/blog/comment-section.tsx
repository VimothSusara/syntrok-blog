import Link from "next/link";
import { CommentForm } from "@/components/blog/comment-form";
import { CommentList } from "@/components/blog/comment-list";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { canComment } from "@/lib/auth/permissions";
import {
  getApprovedCommentCountForPost,
  getApprovedCommentsForPost,
} from "@/lib/db/comments";
import { getOpenCommentReportIdsForPost } from "@/lib/db/reports";

type CommentSectionProps = {
  postId: string;
};

export async function CommentSection({ postId }: CommentSectionProps) {
  const [comments, count, viewer] = await Promise.all([
    getApprovedCommentsForPost(postId),
    getApprovedCommentCountForPost(postId),
    getCurrentUser(),
  ]);

  const mayComment = canComment(viewer);

  const reportedCommentIds = viewer
    ? await getOpenCommentReportIdsForPost(postId, viewer.id)
    : [];

  return (
    <section className="space-y-6 border-t border-border pt-8">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Comments{count ? ` (${count})` : ""}
        </h2>
        <p className="text-sm text-muted-foreground">
          Join the discussion. Be respectful — moderators may remove comments
          that break community guidelines.
        </p>
      </div>

      {mayComment ? (
        <CommentForm postId={postId} />
      ) : (
        <p className="text-sm text-muted-foreground">
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>{" "}
          to leave a comment.
        </p>
      )}

      <CommentList
        comments={comments}
        postId={postId}
        canReply={mayComment}
        isSignedIn={!!viewer}
        viewerId={viewer?.id}
        reportedCommentIds={reportedCommentIds}
      />
    </section>
  );
}
