"use client";

import { useMemo, useState } from "react";
import { getDashboardNav } from "@/config/dashboard-nav";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

type DashboardShellProps = {
  isSuperAdmin: boolean;
  children: React.ReactNode;
};

export function DashboardShell({
  isSuperAdmin,
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = useMemo(() => getDashboardNav(isSuperAdmin), [isSuperAdmin]);

  return (
    <div className="min-h-full lg:grid lg:grid-cols-[16rem_1fr]">
      <DashboardSidebar items={navItems} />

      <div className="flex min-h-full flex-col">
        <DashboardHeader onMenuClick={() => setMobileOpen(true)} />

        <DashboardMobileNav
          open={mobileOpen}
          onOpenChange={setMobileOpen}
          items={navItems}
        />

        <main className="flex-1 px-4 py-8">{children}</main>
      </div>
    </div>
  );
}
