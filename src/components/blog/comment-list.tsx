import type { PublicComment } from "@/lib/db/comments";
import { CommentItem } from "@/components/blog/comment-item";

type CommentListProps = {
  comments: PublicComment[];
  postId: string;
  canReply: boolean;
  isSignedIn?: boolean;
  viewerId?: string;
  reportedCommentIds?: string[];
};

export function CommentList({
  comments,
  postId,
  canReply,
  isSignedIn,
  viewerId,
  reportedCommentIds,
}: CommentListProps) {
  if (!comments.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No comments yet. Be the first to share your thoughts.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          canReply={canReply}
          isSignedIn={isSignedIn}
          viewerId={viewerId}
          reportedCommentIds={reportedCommentIds}
        />
      ))}
    </div>
  );
}
