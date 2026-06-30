"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import type { PublicComment } from "@/lib/db/comments";
import { CommentForm } from "@/components/blog/comment-form";
import { ReportCommentDialog } from "@/components/blog/report-comment-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authorProfileUrl } from "@/lib/urls/authors";
import { getDisplayName, getInitials } from "@/lib/users/display";

type CommentItemProps = {
  comment: PublicComment;
  postId: string;
  canReply: boolean;
  isReply?: boolean;
  isSignedIn?: boolean;
  viewerId?: string;
  reportedCommentIds?: string[];
};

export function CommentItem({
  comment,
  postId,
  canReply,
  isReply = false,
  isSignedIn,
  viewerId,
  reportedCommentIds = [],
}: CommentItemProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const displayName = getDisplayName(comment.user);
  const profileHref = authorProfileUrl(comment.user);

  const isOwnComment = viewerId === comment.user.id;
  const isReported = reportedCommentIds.includes(comment.id);
  const showReport = !!isSignedIn && !isOwnComment && !isReported;

  return (
    <article
      id={`comment-${comment.id}`}
      className={
        isReply
          ? "scroll-mt-24 space-y-3"
          : "scroll-mt-24 space-y-3 border-b border-border pb-6 last:border-0"
      }
    >
      <div className="flex gap-3">
        {profileHref ? (
          <Link href={profileHref}>
            <Avatar size="sm">
              {comment.user.imageUrl ? (
                <AvatarImage src={comment.user.imageUrl} alt={displayName} />
              ) : null}
              <AvatarFallback>
                {getInitials(comment.user.name, comment.user.email)}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Avatar size="sm">
            {comment.user.imageUrl ? (
              <AvatarImage src={comment.user.imageUrl} alt={displayName} />
            ) : null}
            <AvatarFallback>
              {getInitials(comment.user.name, comment.user.email)}
            </AvatarFallback>
          </Avatar>
        )}

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {profileHref ? (
              <Link
                href={profileHref}
                className="text-sm font-medium hover:text-primary"
              >
                {displayName}
              </Link>
            ) : (
              <span className="text-sm font-medium">{displayName}</span>
            )}
            <time
              dateTime={comment.createdAt.toISOString()}
              className="text-xs text-muted-foreground"
            >
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </time>
          </div>

          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {comment.content}
          </p>

          {(showReport || (!isReply && canReply) || isReported) && (
            <div className="flex flex-wrap items-center gap-1">
              {!isReply && canReply && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setReplyOpen((open) => !open)}
                >
                  Reply
                </Button>
              )}

              {showReport ? (
                <ReportCommentDialog
                  commentId={comment.id}
                  postId={postId}
                  isSignedIn
                />
              ) : null}

              {isReported && isSignedIn && !isOwnComment ? (
                <span className="px-2 text-xs text-muted-foreground">
                  Reported
                </span>
              ) : null}
            </div>
          )}

          {!isReply && replyOpen && (
            <CommentForm
              postId={postId}
              parentId={comment.id}
              placeholder="Write a reply…"
              submitLabel="Post reply"
              onSuccess={() => setReplyOpen(false)}
            />
          )}
        </div>
      </div>

      {!isReply && comment.replies.length > 0 && (
        <div className="ml-11 space-y-4 border-l border-border pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              canReply={canReply}
              isReply
              isSignedIn={isSignedIn}
              viewerId={viewerId}
              reportedCommentIds={reportedCommentIds}
            />
          ))}
        </div>
      )}
    </article>
  );
}
