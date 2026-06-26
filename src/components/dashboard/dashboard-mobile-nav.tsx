"use client";

import Link from "next/link";
import type { DashboardNavItem } from "@/config/dashboard-nav";
import { DashboardNavLinks } from "@/components/dashboard/dashboard-nav-links";
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
};

export function DashboardMobileNav({
  open,
  onOpenChange,
  items,
}: DashboardMobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{siteConfig.name}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 p-4">
          <DashboardNavLinks
            items={items}
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
