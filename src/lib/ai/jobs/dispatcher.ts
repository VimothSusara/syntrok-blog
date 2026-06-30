import "server-only";

import type { AiJobs } from "@/lib/ai/jobs/types";
import { handlePostEmbeddingIndex } from "@/lib/ai/jobs/handlers/index-post-embeddings";
import { handleGenerateSummary } from "@/lib/ai/jobs/handlers/generate-summary";
import { handleGenerateSeoMeta } from "@/lib/ai/jobs/handlers/generate-seo-meta";
import { handleSuggestTags } from "@/lib/ai/jobs/handlers/suggest-tags";
import { handleGenerateRelatedPosts } from "@/lib/ai/jobs/handlers/generate-related-posts";
import { handleGenerateCoverImage } from "@/lib/ai/jobs/handlers/generate-cover-image";

export async function dispatchAiJob(job: AiJobs) {
  switch (job.type) {
    case "post.embedding.index":
      return handlePostEmbeddingIndex({ postId: job.postId });
    case "post.summary.generate":
      return handleGenerateSummary({ postId: job.postId });
    case "post.seo.generate":
      return handleGenerateSeoMeta({ postId: job.postId });
    case "post.tags.suggest":
      return handleSuggestTags({ postId: job.postId });
    case "post.related.generate":
      return handleGenerateRelatedPosts({ postId: job.postId });
    case "post.cover.generate":
      return handleGenerateCoverImage({
        postId: job.postId,
        prompt: job.prompt,
      });
    default: {
      const exhaustive: never = job;
      throw new Error(`Unknown AI job: ${JSON.stringify(exhaustive)}`);
    }
  }
}
