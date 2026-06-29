CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "post_embeddings"
ADD COLUMN IF NOT EXISTS "embedding" vector(768);