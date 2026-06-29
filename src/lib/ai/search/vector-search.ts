import { Prisma } from "../../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type SemanticSearchRow = {
    postId: string;
    chunkText: string;
    similarity: number;
};

export type RelatedPostRow = {
    postId: string;
    similarity: number;
};

function vectorLiteral(embedding: number[]) {
    return Prisma.sql`ARRAY[${Prisma.join(embedding)}]::vector`;
}

export async function searchSemanticMatches(input: {
    embedding: number[];
    limit?: number;
}) {
    const limit = input.limit ?? 20;

    return prisma.$queryRaw<SemanticSearchRow[]>(Prisma.sql`
    SELECT
      pe."postId" AS "postId",
      pe."chunkText" AS "chunkText",
      1 - (pe.embedding <=> ${vectorLiteral(input.embedding)}) AS similarity
    FROM post_embeddings pe
    INNER JOIN posts p ON p.id = pe."postId"
    WHERE p.status = 'PUBLISHED'
    ORDER BY pe.embedding <=> ${vectorLiteral(input.embedding)}
    LIMIT ${limit}
  `);
}

export async function findRelatedPosts(input: {
    embedding: number[];
    limit?: number;
}) {
    const limit = input.limit ?? 6;

    return prisma.$queryRaw<RelatedPostRow[]>(Prisma.sql`
    SELECT
      p.id AS "postId",
      1 - (pe.embedding <=> ${vectorLiteral(input.embedding)}) AS similarity
    FROM post_embeddings pe
    INNER JOIN posts p ON p.id = pe."postId"
    WHERE p.status = 'PUBLISHED'
    ORDER BY pe.embedding <=> ${vectorLiteral(input.embedding)}
    LIMIT ${limit}
  `);
}