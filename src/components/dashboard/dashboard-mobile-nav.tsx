"use client";

import Link from "next/link";
import type { DashboardNavItem } from "@/config/dashboard-nav";
import { DashboardSidebarNav } from "@/components/dashboard/dashboard-sidebar-nav";
import { siteConfig } from "@/config/site";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

type DashboardMobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: DashboardNavItem[];
  isSuperAdmin: boolean;
};

export function DashboardMobileNav({
  open,
  onOpenChange,
  items,
  isSuperAdmin,
}: DashboardMobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{siteConfig.name}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 overflow-y-auto p-4 scrollbar-themed">
          <DashboardSidebarNav
            items={items}
            isSuperAdmin={isSuperAdmin}
            onNavigate={() => onOpenChange(false)}
          />

          <Separator />

          <Link
            href="/"
            onClick={() => onOpenChange(false)}
            className="px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to site
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
