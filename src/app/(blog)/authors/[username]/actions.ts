"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { canFollowUser } from "@/lib/auth/permissions";
import { getPublicAuthorByUsername } from "@/lib/db/authors";
import { FollowError, toggleFollow } from "@/lib/db/follows";

export type FollowActionResult = {
  error?: string;
  following?: boolean;
};

export async function toggleFollowAction(
  targetUserId: string,
  username: string,
): Promise<FollowActionResult> {
  const viewer = await getCurrentUser();
  if (!viewer) {
    return { error: "Sign in to follow authors." };
  }

  const target = await getPublicAuthorByUsername(username);
  if (!target || target.id !== targetUserId) {
    return { error: "Author not found." };
  }

  if (!canFollowUser(viewer, target)) {
    return { error: "You cannot follow this author." };
  }

  try {
    const result = await toggleFollow(viewer.id, targetUserId);
    revalidatePath(`/authors/${username}`);
    revalidatePath("/posts");
    return result;
  } catch (error) {
    if (error instanceof FollowError) {
      return { error: error.message };
    }

    return { error: "Could not update follow status." };
  }
}
