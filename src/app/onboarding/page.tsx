import { redirect } from "next/navigation";
import Link from "next/link";
import { OnboardingForm } from "@/components/dashboard/onboarding-form";
import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isProfileComplete } from "@/lib/auth/profile";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (isProfileComplete(user)) redirect("/dashboard");

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-12">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <Link href="/" className="text-lg font-semibold">
            {siteConfig.name}
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Set up your author profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose a username and optional bio. You can change these later in
            settings.
          </p>
        </div>

        <OnboardingForm />
      </div>
    </div>
  );
}
