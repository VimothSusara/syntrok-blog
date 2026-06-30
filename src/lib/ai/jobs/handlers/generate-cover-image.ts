import { AiError } from "@/lib/ai/errors";

export async function handleGenerateCoverImage(_input: {
  postId: string;
  prompt?: string;
}) {
  throw new AiError("Cover image generation is not implemented yet.");
}