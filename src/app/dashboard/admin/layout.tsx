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
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 lg:hidden">
        <AdminSidebar />
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[14rem_1fr] lg:gap-8">
        <aside className="hidden min-h-0 lg:block">
          <AdminSidebar className="sticky top-0" />
        </aside>

        <div className="min-h-0 min-w-0 overflow-y-auto scrollbar-themed">
          {children}
        </div>
      </div>
    </div>
  );
}
