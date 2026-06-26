import { Badge } from "@/components/ui/badge";
import type { PostStatus } from "../../../generated/prisma/client";

const labels: Record<PostStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
  DELETED: "Deleted",
};

const variants: Record<
  PostStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  DRAFT: "secondary",
  PUBLISHED: "default",
  ARCHIVED: "outline",
  DELETED: "destructive",
};

export function PostStatusBadge({ status }: { status: PostStatus }) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
