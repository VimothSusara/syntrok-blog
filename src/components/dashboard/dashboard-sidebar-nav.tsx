"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Shield } from "lucide-react";
import type { DashboardNavItem } from "@/config/dashboard-nav";
import { adminNavItemsAsDashboard } from "@/config/admin-nav";
import { DashboardNavLinks } from "@/components/dashboard/dashboard-nav-links";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type DashboardSidebarNavProps = {
  items: DashboardNavItem[];
  isSuperAdmin: boolean;
  onNavigate?: () => void;
  className?: string;
};

export function DashboardSidebarNav({
  items,
  isSuperAdmin,
  onNavigate,
  className,
}: DashboardSidebarNavProps) {
  const pathname = usePathname();
  const onAdminRoute = pathname.startsWith("/dashboard/admin");
  const [adminOpen, setAdminOpen] = useState(onAdminRoute);

  useEffect(() => {
    if (onAdminRoute) setAdminOpen(true);
  }, [onAdminRoute]);

  const adminItems = adminNavItemsAsDashboard();

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <DashboardNavLinks items={items} onNavigate={onNavigate} />

      {isSuperAdmin && (
        <>
          <Separator />

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setAdminOpen((open) => !open)}
              aria-expanded={adminOpen}
              aria-controls="dashboard-admin-nav"
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                onAdminRoute
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Shield className="size-4 shrink-0" aria-hidden />
              <span className="flex-1 text-left">Administration</span>
              <ChevronDown
                aria-hidden
                className={cn(
                  "size-4 shrink-0 transition-transform duration-200",
                  adminOpen && "rotate-180",
                )}
              />
            </button>

            <div
              id="dashboard-admin-nav"
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out",
                adminOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <DashboardNavLinks
                  items={adminItems}
                  onNavigate={onNavigate}
                  variant="nested"
                  className="pt-0.5"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
