import { z } from "zod";
import { isTiptapDoc, isTiptapDocEmpty } from "@/lib/posts/content";

export const postFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens",
    ),
  summary: z.string().max(500).optional().or(z.literal("")),
  content: z
    .string()
    .min(1, "Content is required")
    .refine(isTiptapDoc, "Invalid editor content")
    .refine((val) => !isTiptapDocEmpty(val), "Content is required"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  coverImageUrl: z.union([z.url(), z.literal("")]).optional(),
  coverImagePublicId: z.string().optional().or(z.literal("")),
  categoryId: z.cuid2().optional().or(z.literal("")),
  tagIds: z.array(z.cuid2()).default([]),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(320).optional().or(z.literal("")),
});

export type PostFormInput = z.infer<typeof postFormSchema>;

export function parsePostForm(formData: FormData) {
  return postFormSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary") ?? "",
    content: formData.get("content"),
    status: formData.get("status"),
    coverImageUrl: formData.get("coverImageUrl") ?? "",
    coverImagePublicId: formData.get("coverImagePublicId") ?? "",
    categoryId: formData.get("categoryId") ?? "",
    tagIds: formData.getAll("tagIds").map(String),
    metaTitle: formData.get("metaTitle") ?? "",
    metaDescription: formData.get("metaDescription") ?? "",
  });
}
