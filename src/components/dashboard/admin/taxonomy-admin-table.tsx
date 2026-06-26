"use client";

import { useTransition } from "react";
import { Pencil } from "lucide-react";
import type { TaxonomyAdminRow } from "@/lib/types/taxonomy-admin";
import { TaxonomyDeleteDialog } from "@/components/dashboard/admin/taxonomy-delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type TaxonomyAdminTableProps = {
  rows: TaxonomyAdminRow[];
  entityLabel: string;
  onEdit: (row: TaxonomyAdminRow) => void;
  deleteAction: (formData: FormData) => Promise<void>;
  toggleActiveAction: (
    id: string,
    isActive: boolean,
  ) => Promise<{ success?: boolean; error?: string } | void>;
};

export function TaxonomyAdminTable({
  rows,
  entityLabel,
  onEdit,
  deleteAction,
  toggleActiveAction,
}: TaxonomyAdminTableProps) {
  const [pending, startTransition] = useTransition();

  if (!rows.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No {entityLabel.toLowerCase()} match your filters.
      </p>
    );
  }

  return (
    <div
      className="overflow-x-auto rounded-xl border border-border"
      aria-busy={pending}
    >
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/40 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Posts</th>
            <th className="px-4 py-3 font-medium">Updated</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <div className="font-medium">{row.name}</div>
                {row.description && (
                  <div className="line-clamp-1 text-xs text-muted-foreground">
                    {row.description}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                /{row.slug}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={row.isActive}
                    disabled={pending}
                    onCheckedChange={(checked) => {
                      startTransition(async () => {
                        await toggleActiveAction(row.id, checked);
                      });
                    }}
                  />
                  <Badge variant={row.isActive ? "default" : "secondary"}>
                    {row.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </td>
              <td className="px-4 py-3">{row.postCount}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {row.updatedAt.toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(row)}
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                  <TaxonomyDeleteDialog
                    row={row}
                    entityLabel={entityLabel}
                    deleteAction={deleteAction}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
