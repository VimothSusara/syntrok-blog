"use client";

import { useActionState, useEffect, useState } from "react";
import { Flag } from "lucide-react";
import {
  reportCommentAction,
  type ReportCommentActionState,
} from "@/app/(blog)/posts/[slug]/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

const initialState: ReportCommentActionState = {};

type ReportCommentDialogProps = {
  commentId: string;
  postId: string;
  isSignedIn: boolean;
};

export function ReportCommentDialog({
  commentId,
  postId,
  isSignedIn,
}: ReportCommentDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    reportCommentAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
    }
  }, [state.success, router]);

  if (!isSignedIn) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="h-7 px-2">
          <Flag className="size-3.5" />
          Report
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report comment</DialogTitle>
          <DialogDescription>
            Tell moderators why this comment should be reviewed. Reports are
            confidential.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="commentId" value={commentId} />
          <input type="hidden" name="postId" value={postId} />

          <Textarea
            name="reason"
            rows={5}
            required
            minLength={10}
            maxLength={1000}
            placeholder="Describe the issue (spam, harassment, misinformation, etc.)"
          />

          {state.error ? (
            <p className="text-sm text-destructive">{state.error}</p>
          ) : null}
          {state.success ? (
            <p className="text-sm text-muted-foreground">{state.success}</p>
          ) : null}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Submitting…" : "Submit report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
