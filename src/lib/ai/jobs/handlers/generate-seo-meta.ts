import { prisma } from "@/lib/prisma";
import { generatePostSeoMeta } from "@/lib/ai/services/post-ai";

export async function handleGenerateSeoMeta({ postId }: { postId: string }) {
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
    select: {
      id: true,
      authorId: true,
      title: true,
      content: true,
      metaTitle: true,
      metaDescription: true,
    },
  });

  if (post.metaTitle?.trim() && post.metaDescription?.trim()) return;

  const seo = await generatePostSeoMeta({
    postId: post.id,
    userId: post.authorId,
    content: post.content,
    title: post.title,
  });

  await prisma.post.update({
    where: { id: post.id },
    data: {
      metaTitle: post.metaTitle?.trim() ? post.metaTitle : seo.title,
      metaDescription: post.metaDescription?.trim()
        ? post.metaDescription
        : seo.description,
    },
  });
}
