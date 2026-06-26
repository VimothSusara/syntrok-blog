import type { User } from "../../../generated/prisma/client";

export function isSuperAdmin(user: Pick<User, "role">) {
  return user.role === "SUPERADMIN";
}

export function canEditPost(
  user: Pick<User, "id" | "role">,
  post: { authorId: string },
) {
  return user.role === "SUPERADMIN" || user.id === post.authorId;
}

export function canComment(user?: Pick<User, "status"> | null) {
  return !!user && user.status === "ACTIVE";
}
