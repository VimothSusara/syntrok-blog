import { PostStatus } from "../../../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { indexPostEmbeddings } from "@/lib/ai/runtime/index-post-embeddings";

export async function handlePostEmbeddingIndex({ postId }: { postId: string }) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      status: true,
      contentPlain: true,
    },
  });

  if (!post || post.status !== PostStatus.PUBLISHED) return;

  await indexPostEmbeddings(post.id, post.contentPlain ?? "");
}
