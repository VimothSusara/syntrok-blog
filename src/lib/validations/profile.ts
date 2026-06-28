import { z } from "zod";
import { isReservedUsername } from "@/lib/constants/reserved-usernames";

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters.")
  .max(30, "Username must be at most 30 characters.")
  .regex(
    /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])?$/,
    "Use lowercase letters, numbers, and hyphens only.",
  )
  .refine((value) => !isReservedUsername(value), "That username is reserved.");

export const onboardingFormSchema = z.object({
  username: usernameSchema,
  bio: z.string().max(500).optional().or(z.literal("")),
});

export const profileFormSchema = z.object({
  username: usernameSchema,
  bio: z.string().max(500).optional().or(z.literal("")),
});

export type OnboardingFormInput = z.infer<typeof onboardingFormSchema>;
export type ProfileFormInput = z.infer<typeof profileFormSchema>;

export function parseOnboardingForm(formData: FormData) {
  return onboardingFormSchema.safeParse({
    username: formData.get("username") ?? "",
    bio: formData.get("bio") ?? "",
  });
}

export function parseProfileForm(formData: FormData) {
  return profileFormSchema.safeParse({
    username: formData.get("username") ?? "",
    bio: formData.get("bio") ?? "",
  });
}
