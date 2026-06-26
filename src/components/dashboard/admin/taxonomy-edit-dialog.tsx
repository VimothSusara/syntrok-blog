"use client";

import type { TaxonomyActionState } from "@/app/dashboard/admin/categories/actions";
import type { TaxonomyAdminRow } from "@/lib/types/taxonomy-admin";
import { TaxonomyForm } from "@/components/dashboard/admin/taxonomy-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TaxonomyEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  row?: TaxonomyAdminRow | null;
  title: string;
  action: (
    prev: TaxonomyActionState,
    formData: FormData,
  ) => Promise<TaxonomyActionState>;
};

export function TaxonomyEditDialog({
  open,
  onOpenChange,
  mode,
  row,
  title,
  action,
}: TaxonomyEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <TaxonomyForm
          key={mode === "edit" ? row?.id : "create"}
          mode={mode}
          action={action}
          defaultValues={
            row
              ? {
                  name: row.name,
                  slug: row.slug,
                  description: row.description,
                  isActive: row.isActive,
                }
              : undefined
          }
          onSuccess={() => onOpenChange(false)}
          submitLabel={mode === "create" ? "Create" : "Save changes"}
        />
      </DialogContent>
    </Dialog>
  );
}
