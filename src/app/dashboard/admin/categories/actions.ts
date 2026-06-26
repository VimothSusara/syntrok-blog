"use server";

import { revalidatePath } from "next/cache";
import {
  createCategory,
  deleteCategory,
  isCategorySlugTaken,
  setCategoryActive,
  updateCategory,
} from "@/lib/db/categories";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isSuperAdmin } from "@/lib/auth/permissions";
import { slugify } from "@/lib/utils";
import { parseTaxonomyForm } from "@/lib/validations/taxonomy";

export type TaxonomyActionState = {
  error?: string;
  success?: string;
};

async function requireSuperAdmin() {
  const user = await getCurrentUser();
  if (!user || !isSuperAdmin(user)) return null;
  return user;
}

export async function createCategoryAction(
  _prev: TaxonomyActionState,
  formData: FormData,
): Promise<TaxonomyActionState> {
  if (!(await requireSuperAdmin())) return { error: "Unauthorized." };

  const parsed = parseTaxonomyForm(formData);
  if (!parsed.success) return { error: "Invalid form data." };

  const data = parsed.data;
  const slug = data.slug || slugify(data.name);

  if (await isCategorySlugTaken(slug)) {
    return { error: "That slug is already taken." };
  }

  await createCategory({ ...data, slug });
  revalidatePath("/dashboard/admin/categories");
  revalidatePath("/posts");
  return { success: "Category created." };
}

export async function updateCategoryAction(
  categoryId: string,
  _prev: TaxonomyActionState,
  formData: FormData,
): Promise<TaxonomyActionState> {
  if (!(await requireSuperAdmin())) return { error: "Unauthorized." };

  const parsed = parseTaxonomyForm(formData);
  if (!parsed.success) return { error: "Invalid form data." };

  const data = parsed.data;
  const slug = data.slug || slugify(data.name);

  if (await isCategorySlugTaken(slug, categoryId)) {
    return { error: "That slug is already taken." };
  }

  await updateCategory(categoryId, { ...data, slug });
  revalidatePath("/dashboard/admin/categories");
  revalidatePath("/posts");
  return { success: "Category updated." };
}

export async function deleteCategoryAction(formData: FormData) {
  if (!(await requireSuperAdmin())) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await deleteCategory(id);
  revalidatePath("/dashboard/admin/categories");
  revalidatePath("/posts");
}

export async function toggleCategoryActiveAction(
  id: string,
  isActive: boolean,
) {
  if (!(await requireSuperAdmin())) return { error: "Unauthorized." };
  await setCategoryActive(id, isActive);
  revalidatePath("/dashboard/admin/categories");
  revalidatePath("/posts");
  return { success: true };
}
