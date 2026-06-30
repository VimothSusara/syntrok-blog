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

export function canFollowUser(
  viewer: Pick<User, "id" | "status"> | null | undefined,
  target: Pick<User, "id" | "status" | "username"> | null | undefined,
) {
  if (!viewer || !target) return false;
  if (viewer.status !== "ACTIVE" || target.status !== "ACTIVE") return false;
  if (viewer.id === target.id) return false;
  if (!target.username) return false;
  return true;
}

export function canReactToPost(
  user: Pick<User, "id" | "status"> | null | undefined,
  post: Pick<{ status: string }, "status"> | null | undefined,
) {
  if (!user || !post) return false;
  if (user.status !== "ACTIVE") return false;
  return post.status === "PUBLISHED";
}

export function canSavePost(
  user: Pick<User, "id" | "status"> | null | undefined,
  post: Pick<{ status: string }, "status"> | null | undefined,
) {
  if (!user || !post) return false;
  if (user.status !== "ACTIVE") return false;
  return post.status === "PUBLISHED";
}

export function canReportContent(
  user: Pick<User, "id" | "status"> | null | undefined,
) {
  return !!user && user.status === "ACTIVE";
}
