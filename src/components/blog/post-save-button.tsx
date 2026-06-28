"use client";

import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { togglePostSaveAction } from "@/app/(blog)/posts/[slug]/action";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PostSaveButtonProps = {
  postId: string;
  postSlug: string;
  initialSaved: boolean;
  isSignedIn: boolean;
  canSave: boolean;
};

export function PostSaveButton({
  postId,
  postSlug,
  initialSaved,
  isSignedIn,
  canSave,
}: PostSaveButtonProps) {
  const [pending, startTransition] = useTransition();
  const [optimisticSaved, setOptimisticSaved] = useOptimistic(initialSaved);

  if (!isSignedIn) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/sign-in" className="gap-2">
          <Bookmark className="size-4" aria-hidden />
          Sign in to save
        </Link>
      </Button>
    );
  }

  if (!canSave) {
    return null;
  }

  return (
    <Button
      type="button"
      variant={optimisticSaved ? "secondary" : "outline"}
      size="sm"
      disabled={pending}
      aria-pressed={optimisticSaved}
      aria-label={optimisticSaved ? "Remove from saved" : "Save post"}
      className="gap-2"
      onClick={() => {
        startTransition(async () => {
          const nextSaved = !optimisticSaved;
          setOptimisticSaved(nextSaved);

          const result = await togglePostSaveAction(postId, postSlug);

          if (result.error) {
            setOptimisticSaved(optimisticSaved);
          } else if (typeof result.saved === "boolean") {
            setOptimisticSaved(result.saved);
          }
        });
      }}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Bookmark className={cn("size-4", optimisticSaved && "fill-current")} />
      )}
      {optimisticSaved ? "Saved" : "Save"}
    </Button>
  );
}
