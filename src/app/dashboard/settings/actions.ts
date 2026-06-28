"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { saveUserProfile } from "@/lib/profile/save-profile";
import { parseProfileForm } from "@/lib/validations/profile";

export type ProfileActionState = {
  error?: string;
  success?: string;
};

export async function updateProfileAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized." };

  const parsed = parseProfileForm(formData);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid form data.",
    };
  }

  const result = await saveUserProfile(user.id, parsed.data);
  if (!result.ok) return { error: result.error };

  revalidatePath("/dashboard/settings");
  if (result.username) {
    revalidatePath(`/authors/${result.username}`);
  }

  return { success: "Profile updated." };
}
