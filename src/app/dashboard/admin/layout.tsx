import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isSuperAdmin } from "@/lib/auth/permissions";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || !isSuperAdmin(user)) redirect("/dashboard");

  return (
    <div className="space-y-8">
      <div className="lg:hidden">
        <AdminSidebar />
      </div>

      <div className="lg:grid lg:grid-cols-[14rem_1fr] lg:gap-8">
        <aside className="hidden lg:block">
          <AdminSidebar />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
