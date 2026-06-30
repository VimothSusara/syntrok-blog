"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import {
  quickCreateCategoryAction,
  quickCreateTagAction,
} from "@/app/dashboard/posts/taxonomy-actions";
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
import { Input } from "@/components/ui/input";

type QuickCreateTaxonomyDialogProps = {
  kind: "category" | "tag";
  onCreated: (item: { id: string; name: string; slug: string }) => void;
};

export function QuickCreateTaxonomyDialog({
  kind,
  onCreated,
}: QuickCreateTaxonomyDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const label = kind === "category" ? "category" : "tag";
  const title = kind === "category" ? "Create category" : "Create tag";

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const result =
        kind === "category"
          ? await quickCreateCategoryAction(name)
          : await quickCreateTagAction(name);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.data) {
        onCreated(result.data);
        setName("");
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-7 shrink-0"
          aria-label={`Create ${label}`}
        >
          <Plus className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Add a new {label} without leaving the post editor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label htmlFor={`quick-${kind}-name`} className="text-sm font-medium">
            Name
          </label>
          <Input
            id={`quick-${kind}-name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={kind === "category" ? "Engineering" : "Blockchain"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={submit}
            disabled={pending || !name.trim()}
          >
            {pending ? "Creating…" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
