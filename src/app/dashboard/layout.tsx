import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isProfileComplete } from "@/lib/auth/profile";
import { isSuperAdmin } from "@/lib/auth/permissions";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (!isProfileComplete(user)) redirect("/onboarding");

  return (
    <DashboardShell isSuperAdmin={isSuperAdmin(user)}>
      {children}
    </DashboardShell>
  );
}
