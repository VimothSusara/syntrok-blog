"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  createCommentAction,
  type CommentActionState,
} from "@/app/(blog)/posts/[slug]/action";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type CommentFormProps = {
  postId: string;
  parentId?: string;
  placeholder?: string;
  submitLabel?: string;
  onSuccess?: () => void;
};

const initialState: CommentActionState = {};

export function CommentForm({
  postId,
  parentId,
  placeholder = "Write a comment…",
  submitLabel = "Post comment",
  onSuccess,
}: CommentFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    createCommentAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      onSuccess?.();
      router.refresh();
    }
  }, [state.success, onSuccess, router]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="postId" value={postId} />
      {parentId ? (
        <input type="hidden" name="parentId" value={parentId} />
      ) : null}

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-primary">{state.success}</p>}

      <Textarea
        name="content"
        placeholder={placeholder}
        rows={parentId ? 3 : 4}
        required
        maxLength={2000}
      />

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Posting…" : submitLabel}
      </Button>
    </form>
  );
}
