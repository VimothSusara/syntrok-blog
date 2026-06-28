import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { authorProfileUrl } from "@/lib/urls/authors";

export default async function DashboardSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const profileUrl = user.username ? authorProfileUrl(user) : null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your public author profile.
        </p>
      </div>

      {profileUrl && (
        <p className="text-sm text-muted-foreground">
          Public profile:{" "}
          <Link href={profileUrl} className="text-primary hover:underline">
            {profileUrl}
          </Link>
        </p>
      )}

      <ProfileForm
        defaultValues={{
          username: user.username ?? "",
          bio: user.bio ?? "",
        }}
      />
    </div>
  );
}
