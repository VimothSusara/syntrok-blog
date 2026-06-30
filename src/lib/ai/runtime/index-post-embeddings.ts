import { Prisma } from "../../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getProvider } from "@/lib/ai/registry";
import { loadFeatureConfig } from "@/lib/ai/config/loader";

type PostEmbeddingRow = {
    chunkIndex: number;
    chunkText: string;
    embedding: number[];
    modelSlug: string;
};

function vectorStringLiteral(embedding: number[]) {
    return `[${embedding.join(",")}]`;
}

export async function indexPostEmbeddings(postId: string, sourceText: string) {
    const feature = await loadFeatureConfig("post.semantic_search");
    if (!feature.embeddingModel) {
        throw new Error("Semantic search feature is missing embedding model");
    }

    const provider = getProvider(feature.embeddingModel.provider.slug);
    if (!provider.generateEmbedding) {
        throw new Error(`Provider ${provider.slug} does not support embeddings`);
    }

    const chunks = chunkText(sourceText, 800);

    const rows: PostEmbeddingRow[] = [];
    for (let index = 0; index < chunks.length; index += 1) {
        const chunkText = chunks[index];
        const { embedding } = await provider.generateEmbedding({
            modelSlug: feature.embeddingModel.slug,
            input: chunkText,
            config: {
                ...(feature.embeddingModel.config as Record<string, unknown>),
                ...(feature.config as Record<string, unknown>),
            },
        });

        rows.push({
            chunkIndex: index,
            chunkText,
            embedding,
            modelSlug: feature.embeddingModel.slug,
        });
    }

    await prisma.$transaction(async (tx) => {
        await tx.postEmbedding.deleteMany({ where: { postId } });

        for (const row of rows) {
            const embeddingValue = vectorStringLiteral(row.embedding);
            await tx.$executeRaw(Prisma.sql`
        INSERT INTO "post_embeddings" (
          "id",
          "postId",
          "chunkIndex",
          "chunkText",
          "embedding",
          "modelSlug",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          gen_random_uuid()::text,
          ${postId},
          ${row.chunkIndex},
          ${row.chunkText},
          ${embeddingValue}::vector,
          ${row.modelSlug},
          NOW(),
          NOW()
        )
      `);
        }
    });
}

function chunkText(text: string, maxLength: number) {
    const chunks: string[] = [];
    let current = "";

    for (const paragraph of text.split("\n\n")) {
        const next = current ? `${current}\n\n${paragraph}` : paragraph;

        if (next.length > maxLength && current) {
            chunks.push(current);
            current = paragraph;
            continue;
        }

        if (next.length > maxLength) {
            chunks.push(paragraph.slice(0, maxLength));
            current = "";
            continue;
        }

        current = next;
    }

    if (current) chunks.push(current);

    return chunks.length > 0 ? chunks : [text];
}