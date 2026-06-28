import Link from "next/link";
import type { DashboardNavItem } from "@/config/dashboard-nav";
import { siteConfig } from "@/config/site";
import { DashboardSidebarNav } from "@/components/dashboard/dashboard-sidebar-nav";
import { Separator } from "@/components/ui/separator";

type DashboardSidebarProps = {
  items: DashboardNavItem[];
  isSuperAdmin: boolean;
};

export function DashboardSidebar({
  items,
  isSuperAdmin,
}: DashboardSidebarProps) {
  return (
    <aside className="hidden h-full min-h-0 border-r border-border bg-muted/20 lg:flex lg:w-64 lg:flex-col">
      <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
        <Link href="/dashboard" className="font-semibold text-foreground">
          {siteConfig.name}
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 scrollbar-themed">
        <DashboardSidebarNav items={items} isSuperAdmin={isSuperAdmin} />

        <Separator />

        <Link
          href="/"
          className="px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
