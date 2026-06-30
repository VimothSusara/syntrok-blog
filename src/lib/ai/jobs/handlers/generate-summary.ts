import { prisma } from "@/lib/prisma";
import { generatePostSummary } from "@/lib/ai/services/post-ai";

export async function handleGenerateSummary({ postId }: { postId: string }) {
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
    select: {
      id: true,
      authorId: true,
      content: true,
      summary: true,
    },
  });

  if (post.summary?.trim()) return;

  const summary = await generatePostSummary({
    postId: post.id,
    userId: post.authorId,
    content: post.content,
  });

  await prisma.post.update({
    where: { id: post.id },
    data: { summary },
  });
}
