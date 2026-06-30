import { prisma } from "@/lib/prisma";
import { suggestPostTags } from "@/lib/ai/services/post-ai";

export async function handleSuggestTags({ postId }: { postId: string }) {
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
    select: {
      id: true,
      authorId: true,
      content: true,
    },
  });

  await suggestPostTags({
    postId: post.id,
    userId: post.authorId,
    content: post.content,
  });
}
