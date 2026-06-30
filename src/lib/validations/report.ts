import { z } from "zod";

export const reportReasonSchema = z
  .string()
  .trim()
  .min(10, "Please provide at least 10 characters.")
  .max(1000, "Reason must be at most 1000 characters.");

export const reportCommentSchema = z.object({
  commentId: z.string().min(1),
  postId: z.string().min(1),
  reason: reportReasonSchema,
});

export function parseReportCommentForm(formData: FormData) {
  return reportCommentSchema.safeParse({
    commentId: formData.get("commentId"),
    postId: formData.get("postId"),
    reason: formData.get("reason"),
  });
}
