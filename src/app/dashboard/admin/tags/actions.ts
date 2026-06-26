"use server";

import { revalidatePath } from "next/cache";
import {
  createTag,
  deleteTag,
  isTagSlugTaken,
  updateTag,
  setTagActive,
} from "@/lib/db/tags";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isSuperAdmin } from "@/lib/auth/permissions";
import { slugify } from "@/lib/utils";
import { parseTaxonomyForm } from "@/lib/validations/taxonomy";
import type { TaxonomyActionState } from "@/app/dashboard/admin/categories/actions";

async function requireSuperAdmin() {
  const user = await getCurrentUser();
  if (!user || !isSuperAdmin(user)) return null;
  return user;
}

export async function createTagAction(
  _prev: TaxonomyActionState,
  formData: FormData,
): Promise<TaxonomyActionState> {
  if (!(await requireSuperAdmin())) return { error: "Unauthorized." };

  const parsed = parseTaxonomyForm(formData);
  if (!parsed.success) return { error: "Invalid form data." };

  const data = parsed.data;
  const slug = data.slug || slugify(data.name);

  if (await isTagSlugTaken(slug)) {
    return { error: "That slug is already taken." };
  }

  await createTag({ ...data, slug });
  revalidatePath("/dashboard/admin/tags");
  revalidatePath("/posts");
  return { success: "Tag created." };
}

export async function updateTagAction(
  tagId: string,
  _prev: TaxonomyActionState,
  formData: FormData,
): Promise<TaxonomyActionState> {
  if (!(await requireSuperAdmin())) return { error: "Unauthorized." };

  const parsed = parseTaxonomyForm(formData);
  if (!parsed.success) return { error: "Invalid form data." };

  const data = parsed.data;
  const slug = data.slug || slugify(data.name);

  if (await isTagSlugTaken(slug, tagId)) {
    return { error: "That slug is already taken." };
  }

  await updateTag(tagId, { ...data, slug });
  revalidatePath("/dashboard/admin/tags");
  revalidatePath("/posts");
  return { success: "Tag updated." };
}

export async function deleteTagAction(formData: FormData) {
  if (!(await requireSuperAdmin())) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await deleteTag(id);
  revalidatePath("/dashboard/admin/tags");
  revalidatePath("/posts");
}

export async function toggleTagActiveAction(id: string, isActive: boolean) {
  if (!(await requireSuperAdmin())) return { error: "Unauthorized." };
  await setTagActive(id, isActive);
  revalidatePath("/dashboard/admin/tags");
  revalidatePath("/posts");
  return { success: true };
}
