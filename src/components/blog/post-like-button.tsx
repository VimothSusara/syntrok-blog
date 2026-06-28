"use client";

import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { Heart, Loader2 } from "lucide-react";
import { togglePostLikeAction } from "@/app/(blog)/posts/[slug]/action";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PostLikeButtonProps = {
  postId: string;
  postSlug: string;
  initialLikeCount: number;
  initialLiked: boolean;
  isSignedIn: boolean;
  canReact: boolean;
};

type LikeState = {
  liked: boolean;
  count: number;
};

function formatLikeLabel(count: number) {
  return `${count} ${count === 1 ? "like" : "likes"}`;
}

export function PostLikeButton({
  postId,
  postSlug,
  initialLikeCount,
  initialLiked,
  isSignedIn,
  canReact,
}: PostLikeButtonProps) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic<LikeState>({
    liked: initialLiked,
    count: initialLikeCount,
  });

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Heart className="size-5" aria-hidden />
        <span>{formatLikeLabel(initialLikeCount)}</span>
        <Link
          href="/sign-in"
          className="font-medium text-primary hover:underline"
        >
          Sign in to like
        </Link>
      </div>
    );
  }

  if (!canReact) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Heart className="size-5" aria-hidden />
        <span>{formatLikeLabel(initialLikeCount)}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant={optimistic.liked ? "secondary" : "ghost"}
        size="sm"
        disabled={pending}
        aria-pressed={optimistic.liked}
        aria-label={optimistic.liked ? "Unlike post" : "Like post"}
        onClick={() => {
          startTransition(async () => {
            const nextLiked = !optimistic.liked;
            const nextCount = Math.max(
              0,
              optimistic.count + (nextLiked ? 1 : -1),
            );

            setOptimistic({ liked: nextLiked, count: nextCount });

            const result = await togglePostLikeAction(postId, postSlug);

            if (result.error) {
              setOptimistic({
                liked: optimistic.liked,
                count: optimistic.count,
              });
            } else if (
              typeof result.likeCount === "number" &&
              typeof result.liked === "boolean"
            ) {
              setOptimistic({
                liked: result.liked,
                count: result.likeCount,
              });
            }
          });
        }}
        className="gap-2 cursor-pointer"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Heart
            className={cn(
              "size-4",
              optimistic.liked && "fill-current text-destructive",
            )}
          />
        )}
        {optimistic.liked ? "Liked" : "Like"}
      </Button>

      <span className="text-sm text-muted-foreground">
        {formatLikeLabel(optimistic.count)}
      </span>
    </div>
  );
}

