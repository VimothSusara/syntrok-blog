"use client";

import { useTransition } from "react";
import type { PostStatus } from "../../../generated/prisma/client";
import { updatePostStatusAction } from "@/app/dashboard/posts/actions";
import { Button } from "@/components/ui/button";

type PostStatusActionsProps = {
  postId: string;
  status: PostStatus;
};

export function PostStatusActions({ postId, status }: PostStatusActionsProps) {
  const [pending, startTransition] = useTransition();

  const setStatus = (next: PostStatus) => {
    startTransition(async () => {
      await updatePostStatusAction(postId, next);
    });
  };

  if (status === "DELETED") return null;

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "PUBLISHED" && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={pending}
          onClick={() => setStatus("PUBLISHED")}
        >
          {pending ? "…" : "Publish"}
        </Button>
      )}

      {status === "PUBLISHED" && (
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => setStatus("DRAFT")}
          >
            Unpublish
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pending}
            onClick={() => setStatus("ARCHIVED")}
          >
            Archive
          </Button>
        </>
      )}

      {status === "ARCHIVED" && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => setStatus("DRAFT")}
        >
          Move to draft
        </Button>
      )}
    </div>
  );
}
