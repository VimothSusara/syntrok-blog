import { getTagsPaginated } from "@/lib/db/tags";
import { parseTaxonomyAdminFilters } from "@/lib/search-params/taxonomy-admin";
import { TaxonomyAdminPageContent } from "@/components/dashboard/admin/taxonomy-admin-page-content";
import {
  createTagAction,
  deleteTagAction,
  toggleTagActiveAction,
  updateTagAction,
} from "./actions";

export default async function AdminTagsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const filters = parseTaxonomyAdminFilters(raw);
  const { items, total, pagination } = await getTagsPaginated(filters);

  return (
    <TaxonomyAdminPageContent
      title="Tags"
      description="Manage post tags. Posts can have many tags."
      basePath="/dashboard/admin/tags"
      entityLabel="tag"
      entityLabelPlural="Tags"
      rows={items}
      total={total}
      pagination={pagination}
      filters={filters}
      createAction={createTagAction}
      updateAction={updateTagAction}
      deleteAction={deleteTagAction}
      toggleActiveAction={toggleTagActiveAction}
    />
  );
}
