import { prisma } from "@/lib/prisma"
import { indexPostEmbeddings } from "@/lib/ai/runtime/index-post-embeddings"

export async function handlePostEmbeddingIndex({ postId }: { postId: string }) {
    const post = await prisma.post.findUniqueOrThrow({
        where: { id: postId },
        select: {
            id: true,
            contentPlain: true,
        }
    })  

    await indexPostEmbeddings(post.id, post.contentPlain ?? "")
}
