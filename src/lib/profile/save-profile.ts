import "server-only";

import { isUsernameTaken, updateUserProfile } from "@/lib/db/users";
import type {
  OnboardingFormInput,
  ProfileFormInput,
} from "@/lib/validations/profile";

export type SaveProfileResult =
  | { ok: true; username: string | null }
  | { ok: false; error: string };

export async function saveUserProfile(
  userId: string,
  input: OnboardingFormInput | ProfileFormInput,
): Promise<SaveProfileResult> {
  if (await isUsernameTaken(input.username, userId)) {
    return { ok: false, error: "That username is already taken." };
  }

  const updated = await updateUserProfile(userId, {
    username: input.username,
    bio: input.bio ?? "",
  });

  return { ok: true, username: updated.username };
}
