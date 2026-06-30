export type AiJobs =
    | { type: "post.embedding.index"; postId: string }
    | { type: "post.summary.generate"; postId: string }
    | { type: "post.seo.generate"; postId: string }
    | { type: "post.tags.suggest"; postId: string }
    | { type: "post.related.generate"; postId: string }
    | { type: "post.cover.generate"; postId: string, prompt?: string }