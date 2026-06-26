import type { Prisma } from "../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { TaxonomyFormInput } from "@/lib/validations/taxonomy";
import {
  buildPaginationMeta,
  getSkip,
  type PaginationMeta,
} from "@/lib/pagination";
import type { TaxonomyAdminFilters } from "@/lib/search-params/taxonomy-admin";
import type { TaxonomyAdminRow } from "@/lib/types/taxonomy-admin";

export async function getActiveCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function isCategorySlugTaken(slug: string, excludeId?: string) {
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (!existing) return false;
  if (excludeId && existing.id === excludeId) return false;
  return true;
}

export async function createCategory(input: TaxonomyFormInput) {
  return prisma.category.create({
    data: {
      name: input.name.trim(),
      slug: input.slug,
      description: input.description?.trim() || null,
      isActive: input.isActive,
    },
  });
}

export async function updateCategory(id: string, input: TaxonomyFormInput) {
  return prisma.category.update({
    where: { id },
    data: {
      name: input.name.trim(),
      slug: input.slug,
      description: input.description?.trim() || null,
      isActive: input.isActive,
    },
  });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}

function buildCategoryWhere(
  filters: TaxonomyAdminFilters,
): Prisma.CategoryWhereInput {
  const where: Prisma.CategoryWhereInput = {};
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { slug: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  if (filters.status === "active") where.isActive = true;
  if (filters.status === "inactive") where.isActive = false;
  return where;
}

export async function getCategoriesPaginated(filters: TaxonomyAdminFilters) {
  const where = buildCategoryWhere(filters);
  const skip = getSkip(filters.page, filters.pageSize);
  const [rows, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: filters.pageSize,
      include: { _count: { select: { posts: true } } },
    }),
    prisma.category.count({ where }),
  ]);
  const items: TaxonomyAdminRow[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    postCount: row._count.posts,
  }));
  const pagination: PaginationMeta = buildPaginationMeta(
    filters.page,
    filters.pageSize,
    total,
  );
  return { items, total, pagination };
}

export async function setCategoryActive(id: string, isActive: boolean) {
  return prisma.category.update({
    where: { id },
    data: { isActive },
  });
}
