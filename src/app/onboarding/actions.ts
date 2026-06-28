"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isProfileComplete } from "@/lib/auth/profile";
import { saveUserProfile } from "@/lib/profile/save-profile";
import { parseOnboardingForm } from "@/lib/validations/profile";

export type OnboardingActionState = {
  error?: string;
};

export async function completeOnboardingAction(
  _prev: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized." };

  if (isProfileComplete(user)) {
    redirect("/dashboard");
  }

  const parsed = parseOnboardingForm(formData);
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

  redirect("/dashboard");
}
