/*
  Warnings:

  - A unique constraint covering the columns `[postId,userId]` on the table `reactions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "reactions_postId_userId_type_key";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "posts_status_likeCount_idx" ON "posts"("status", "likeCount" DESC);

-- CreateIndex
CREATE INDEX "reactions_postId_type_idx" ON "reactions"("postId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_postId_userId_key" ON "reactions"("postId", "userId");
