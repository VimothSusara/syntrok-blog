"use client";

import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { Loader2, UserCheck, UserPlus } from "lucide-react";
import { toggleFollowAction } from "@/app/(blog)/authors/[username]/actions";
import { Button } from "@/components/ui/button";

type FollowAuthorButtonProps = {
  targetUserId: string;
  username: string;
  initialFollowing: boolean;
  isSignedIn: boolean;
  size?: "sm" | "default";
};

export function FollowAuthorButton({
  targetUserId,
  username,
  initialFollowing,
  isSignedIn,
  size = "default",
}: FollowAuthorButtonProps) {
  const [pending, startTransition] = useTransition();
  const [optimisticFollowing, setOptimisticFollowing] =
    useOptimistic(initialFollowing);

  if (!isSignedIn) {
    return (
      <Button asChild size={size} variant="outline">
        <Link href="/sign-in">Follow</Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size={size}
      variant={optimisticFollowing ? "secondary" : "default"}
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          setOptimisticFollowing(!optimisticFollowing);
          const result = await toggleFollowAction(targetUserId, username);

          if (result.error) {
            setOptimisticFollowing(optimisticFollowing);
          }
        });
      }}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : optimisticFollowing ? (
        <>
          <UserCheck className="size-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="size-4" />
          Follow
        </>
      )}
    </Button>
  );
}
