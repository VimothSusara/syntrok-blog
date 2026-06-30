/*
  Warnings:

  - Made the column `embedding` on table `post_embeddings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "post_embeddings" ALTER COLUMN "embedding" SET NOT NULL;
