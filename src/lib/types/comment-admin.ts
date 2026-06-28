import type { CommentModerationStatus } from "@/lib/search-params/comment-admin";

export type CommentAdminRow = {
  id: string;
  content: string;
  status: CommentModerationStatus;
  createdAt: Date;
  parentId: string | null;
  user: {
    id: string;
    username: string | null;
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
  post: {
    id: string;
    title: string;
    slug: string;
  };
};
