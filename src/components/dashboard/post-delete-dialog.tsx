"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deletePostAction } from "@/app/dashboard/posts/actions";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PostDeleteDialogProps = {
  postId: string;
  title: string;
  slug: string;
};

export function PostDeleteDialog({
  postId,
  title,
  slug,
}: PostDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [confirmSlug, setConfirmSlug] = useState("");
  const [pending, startTransition] = useTransition();

  const canDelete = confirmSlug === slug;

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setConfirmSlug("");
  };

  const onDelete = () => {
    if (!canDelete) return;
    startTransition(async () => {
      await deletePostAction(postId);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" type="button">
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md sm:max-w-lg">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>Delete this post permanently?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-left">
              <p>
                You are about to delete <strong>{title}</strong>. This will:
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm">
                <li>Remove the post from your dashboard and the public blog</li>
                <li>
                  Delete the cover image and inline images from Cloudinary
                </li>
                <li>Cannot be undone from the UI</li>
              </ul>
              <p className="text-sm">
                Type{" "}
                <code className="rounded bg-muted px-1 py-0.5">{slug}</code> to
                confirm.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input
          value={confirmSlug}
          onChange={(e) => setConfirmSlug(e.target.value)}
          placeholder={slug}
          autoComplete="off"
          disabled={pending}
        />

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={!canDelete || pending}
            onClick={onDelete}
          >
            {pending ? "Deleting…" : "Delete post"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
