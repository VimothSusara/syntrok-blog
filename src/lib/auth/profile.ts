import type { User } from "../../../generated/prisma/client";

export function isProfileComplete(
  user: Pick<User, "username"> | null | undefined,
) {
  return !!user?.username?.trim();
}

export function getPostAuthRedirectPath(
  user: Pick<User, "username"> | null | undefined,
) {
  return isProfileComplete(user) ? "/dashboard" : "/onboarding";
}
