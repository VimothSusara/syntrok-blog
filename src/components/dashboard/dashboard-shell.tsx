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
    <div className="h-dvh overflow-hidden lg:grid lg:grid-cols-[16rem_1fr]">
      <DashboardSidebar items={navItems} isSuperAdmin={isSuperAdmin} />

      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setMobileOpen(true)} />
        <DashboardMobileNav
          open={mobileOpen}
          onOpenChange={setMobileOpen}
          items={navItems}
          isSuperAdmin={isSuperAdmin}
        />
        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-8 scrollbar-themed">
          {children}
        </main>
      </div>
    </div>
  );
}
