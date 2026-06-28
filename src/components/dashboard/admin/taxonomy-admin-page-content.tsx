"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { TaxonomyAdminFilters } from "@/lib/search-params/taxonomy-admin";
import { taxonomyAdminFiltersToParams } from "@/lib/search-params/taxonomy-admin";
import type { TaxonomyAdminRow } from "@/lib/types/taxonomy-admin";
import type { PaginationMeta } from "@/lib/pagination";
import type { TaxonomyActionState } from "@/app/dashboard/admin/categories/actions";
import { TaxonomyAdminToolbar } from "@/components/dashboard/admin/taxonomy-admin-toolbar";
import { TaxonomyAdminTable } from "@/components/dashboard/admin/taxonomy-admin-table";
import { TaxonomyEditDialog } from "@/components/dashboard/admin/taxonomy-edit-dialog";
import { Pagination } from "@/components/shared/pagination";
import { PageHeader } from "@/components/shared/page-header";
import { adminBreadcrumbs } from "@/lib/breadcrumbs";

type TaxonomyAdminPageContentProps = {
  title: string;
  description: string;
  basePath: string;
  entityLabel: string;
  entityLabelPlural: string;
  rows: TaxonomyAdminRow[];
  total: number;
  pagination: PaginationMeta;
  filters: TaxonomyAdminFilters;
  createAction: (
    prev: TaxonomyActionState,
    formData: FormData,
  ) => Promise<TaxonomyActionState>;
  updateAction: (
    id: string,
    prev: TaxonomyActionState,
    formData: FormData,
  ) => Promise<TaxonomyActionState>;
  deleteAction: (formData: FormData) => Promise<void>;
  toggleActiveAction: (
    id: string,
    isActive: boolean,
  ) => Promise<{ success?: boolean; error?: string } | void>;
};

export function TaxonomyAdminPageContent({
  title,
  description,
  basePath,
  entityLabel,
  entityLabelPlural,
  rows,
  total,
  pagination,
  filters,
  createAction,
  updateAction,
  deleteAction,
  toggleActiveAction,
}: TaxonomyAdminPageContentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedRow, setSelectedRow] = useState<TaxonomyAdminRow | null>(null);

  const openCreate = () => {
    setDialogMode("create");
    setSelectedRow(null);
    setDialogOpen(true);
  };

  const openEdit = (row: TaxonomyAdminRow) => {
    setDialogMode("edit");
    setSelectedRow(row);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={adminBreadcrumbs.section(title)}
        title={title}
        description={description}
        meta={
          total === 0
            ? `No ${entityLabelPlural.toLowerCase()} found.`
            : `${total} ${total === 1 ? entityLabel : entityLabelPlural.toLowerCase()}`
        }
      />

      <TaxonomyAdminToolbar
        basePath={basePath}
        filters={filters}
        createLabel={`New ${entityLabel}`}
        onCreateClick={openCreate}
      />

      <TaxonomyAdminTable
        rows={rows}
        entityLabel={entityLabel}
        onEdit={openEdit}
        deleteAction={deleteAction}
        toggleActiveAction={toggleActiveAction}
      />

      <Pagination
        basePath={basePath}
        pagination={pagination}
        params={taxonomyAdminFiltersToParams({ ...filters, page: 1 })}
      />

      <TaxonomyEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        row={selectedRow}
        title={
          dialogMode === "create" ? `New ${entityLabel}` : `Edit ${entityLabel}`
        }
        action={
          dialogMode === "create"
            ? createAction
            : (prev, formData) => updateAction(selectedRow!.id, prev, formData)
        }
      />
    </div>
  );
}
