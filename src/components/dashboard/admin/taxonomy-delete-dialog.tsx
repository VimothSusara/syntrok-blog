"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import type { TaxonomyAdminRow } from "@/lib/types/taxonomy-admin";
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

type TaxonomyDeleteDialogProps = {
  row: Pick<TaxonomyAdminRow, "id" | "name" | "slug" | "postCount">;
  entityLabel: string;
  deleteAction: (formData: FormData) => Promise<void>;
};

export function TaxonomyDeleteDialog({
  row,
  entityLabel,
  deleteAction,
}: TaxonomyDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [confirmSlug, setConfirmSlug] = useState("");
  const [pending, startTransition] = useTransition();

  const mustConfirm = row.postCount > 0;
  const canDelete = !mustConfirm || confirmSlug === row.slug;

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setConfirmSlug("");
  };

  const onDelete = () => {
    if (!canDelete) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", row.id);
      await deleteAction(fd);
      setOpen(false);
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
          <AlertDialogTitle>
            Delete {entityLabel} &ldquo;{row.name}&rdquo;?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-left text-sm">
              {row.postCount > 0 ? (
                <p>
                  This {entityLabel} is used by <strong>{row.postCount}</strong>{" "}
                  {row.postCount === 1 ? "post" : "posts"}. Deleting it will
                  remove the association
                  {entityLabel === "category"
                    ? " (posts will have no category)"
                    : " from those posts"}
                  .
                </p>
              ) : (
                <p>This action cannot be undone.</p>
              )}
              {mustConfirm && (
                <p>
                  Type{" "}
                  <code className="rounded bg-muted px-1 py-0.5">
                    {row.slug}
                  </code>{" "}
                  to confirm.
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {mustConfirm && (
          <Input
            value={confirmSlug}
            onChange={(e) => setConfirmSlug(e.target.value)}
            placeholder={row.slug}
            autoComplete="off"
            disabled={pending}
          />
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={!canDelete || pending}
            onClick={onDelete}
          >
            {pending ? "Deleting…" : `Delete ${entityLabel}`}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
