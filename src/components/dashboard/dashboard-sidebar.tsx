import Link from "next/link";
import type { DashboardNavItem } from "@/config/dashboard-nav";
import { siteConfig } from "@/config/site";
import { DashboardNavLinks } from "@/components/dashboard/dashboard-nav-links";
import { Separator } from "@/components/ui/separator";

type DashboardSidebarProps = {
  items: DashboardNavItem[];
};

export function DashboardSidebar({ items }: DashboardSidebarProps) {
  return (
    <aside className="hidden border-r border-border bg-muted/20 lg:flex lg:w-64 lg:flex-col">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/dashboard" className="font-semibold text-foreground">
          {siteConfig.name}
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <DashboardNavLinks items={items} />

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
