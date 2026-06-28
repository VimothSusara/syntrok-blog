import { z } from "zod";

export const commentContentSchema = z
  .string()
  .trim()
  .min(1, "Comment cannot be empty.")
  .max(2000, "Comment must be at most 2000 characters.");

export const createCommentSchema = z.object({
  postId: z.string().min(1),
  content: commentContentSchema,
  parentId: z.string().min(1).optional().or(z.literal("")),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export function parseCreateCommentForm(formData: FormData) {
  const parentId = formData.get("parentId");
  return createCommentSchema.safeParse({
    postId: formData.get("postId"),
    content: formData.get("content"),
    parentId: typeof parentId === "string" && parentId ? parentId : undefined,
  });
}
