import { getCategoriesPaginated } from "@/lib/db/categories";
import { parseTaxonomyAdminFilters } from "@/lib/search-params/taxonomy-admin";
import { TaxonomyAdminPageContent } from "@/components/dashboard/admin/taxonomy-admin-page-content";
import {
  createCategoryAction,
  deleteCategoryAction,
  toggleCategoryActiveAction,
  updateCategoryAction,
} from "./actions";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const filters = parseTaxonomyAdminFilters(raw);
  const { items, total, pagination } = await getCategoriesPaginated(filters);

  return (
    <TaxonomyAdminPageContent
      title="Categories"
      description="Manage post categories. Each post has one category."
      basePath="/dashboard/admin/categories"
      entityLabel="category"
      entityLabelPlural="Categories"
      rows={items}
      total={total}
      pagination={pagination}
      filters={filters}
      createAction={createCategoryAction}
      updateAction={updateCategoryAction}
      deleteAction={deleteCategoryAction}
      toggleActiveAction={toggleCategoryActiveAction}
    />
  );
}
