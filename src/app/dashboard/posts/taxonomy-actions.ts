"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isSuperAdmin } from "@/lib/auth/permissions";
import {
  createCategory,
  getActiveCategories,
  isCategorySlugTaken,
} from "@/lib/db/categories";
import { createTag, getActiveTags, isTagSlugTaken } from "@/lib/db/tags";
import { slugify } from "@/lib/utils";

export type TaxonomyQuickCreateResult = {
  id: string;
  name: string;
  slug: string;
};

export type TaxonomyActionResponse<T> = {
  error?: string;
  data?: T;
};

export type ApplySuggestedTagsResult = {
  tagIds: string[];
  tags: { id: string; name: string; slug: string }[];
  created: string[];
  unmatched: string[];
};

async function requireSuperAdmin() {
  const user = await getCurrentUser();
  if (!user || !isSuperAdmin(user)) {
    return {
      error: "Only administrators can manage categories and tags." as const,
    };
  }
  return { user };
}

export async function quickCreateCategoryAction(
  name: string,
): Promise<TaxonomyActionResponse<TaxonomyQuickCreateResult>> {
  const auth = await requireSuperAdmin();
  if (auth.error) return { error: auth.error };

  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { error: "Category name must be at least 2 characters." };
  }

  const slug = slugify(trimmed);
  if (await isCategorySlugTaken(slug)) {
    return { error: "A category with that slug already exists." };
  }

  const category = await createCategory({
    name: trimmed,
    slug,
    description: "",
    isActive: true,
  });

  revalidatePath("/dashboard/posts/new");
  revalidatePath("/dashboard/posts");
  revalidatePath("/posts");

  return {
    data: {
      id: category.id,
      name: category.name,
      slug: category.slug,
    },
  };
}

export async function quickCreateTagAction(
  name: string,
): Promise<TaxonomyActionResponse<TaxonomyQuickCreateResult>> {
  const auth = await requireSuperAdmin();
  if (auth.error) return { error: auth.error };

  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { error: "Tag name must be at least 2 characters." };
  }

  const slug = slugify(trimmed);
  if (await isTagSlugTaken(slug)) {
    return { error: "A tag with that slug already exists." };
  }

  const tag = await createTag({
    name: trimmed,
    slug,
    description: "",
    isActive: true,
  });

  revalidatePath("/dashboard/posts/new");
  revalidatePath("/dashboard/posts");
  revalidatePath("/posts");

  return {
    data: {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    },
  };
}

export async function applySuggestedTagsAction(
  suggestions: string[],
  selectedTagIds: string[] = [],
): Promise<TaxonomyActionResponse<ApplySuggestedTagsResult>> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to use AI features." };

  const available = await getActiveTags();
  const resolvedIds: string[] = [];
  const created: string[] = [];
  const unmatched: string[] = [];

  for (const raw of suggestions) {
    const label = raw.trim();
    if (!label) continue;

    const slug = slugify(label);
    let tag = available.find(
      (t) => t.slug === slug || t.name.toLowerCase() === label.toLowerCase(),
    );

    if (!tag && isSuperAdmin(user)) {
      if (!(await isTagSlugTaken(slug))) {
        const newTag = await createTag({
          name: label,
          slug,
          description: "",
          isActive: true,
        });
        tag = {
          id: newTag.id,
          name: newTag.name,
          slug: newTag.slug,
        };
        available.push(tag);
        created.push(label);
      }
    }

    if (tag) resolvedIds.push(tag.id);
    else unmatched.push(label);
  }

  const tagIds = Array.from(new Set([...selectedTagIds, ...resolvedIds]));
  const tags = await getActiveTags();

  revalidatePath("/dashboard/posts");

  return {
    data: {
      tagIds,
      tags,
      created,
      unmatched,
    },
  };
}
