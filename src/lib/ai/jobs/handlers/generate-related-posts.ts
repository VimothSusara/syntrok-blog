import { PostStatus } from "../../../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { runAiFeature } from "@/lib/ai/orchestrator";
import { tiptapJsonToPlainText } from "@/lib/posts/content";

export async function handleGenerateRelatedPosts({
  postId,
}: {
  postId: string;
}) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      authorId: true,
      status: true,
      content: true,
    },
  });

  if (!post || post.status !== PostStatus.PUBLISHED) return;

  const sourceText = tiptapJsonToPlainText(post.content);
  if (!sourceText.trim()) return;

  await runAiFeature("post.related_posts", {
    postId: post.id,
    userId: post.authorId,
    variables: { sourceText },
  });
}
