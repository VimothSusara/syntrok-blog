"use client";

import { adminNavItems } from "@/config/admin-nav";
import type { AdminNavItem } from "@/config/admin-nav";
import { DashboardNavLinks } from "@/components/dashboard/dashboard-nav-links";
import type { DashboardNavItem } from "@/config/dashboard-nav";
import { cn } from "@/lib/utils";

function toDashboardShape(items: AdminNavItem[]): DashboardNavItem[] {
  return items.map((item) => ({
    title: item.title,
    href: item.href,
    icon: item.icon,
    exact: item.exact,
  }));
}

type AdminSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function AdminSidebar({ className, onNavigate }: AdminSidebarProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Admin
      </p>
      <DashboardNavLinks
        items={toDashboardShape(adminNavItems)}
        onNavigate={onNavigate}
      />
    </div>
  );
}
