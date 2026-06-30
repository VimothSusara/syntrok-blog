import { enqueueAiJob } from "@/lib/queue/ai-jobs";

export async function enqueuePostEmbeddingIndex(postId: string) {
  await enqueueAiJob({ type: "post.embedding.index", postId });
}

export async function enqueuePostPublishAiJobs(postId: string) {
  await enqueuePostEmbeddingIndex(postId);
}
