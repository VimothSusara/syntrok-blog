"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DashboardNavItem } from "@/config/dashboard-nav";
import { navIcons } from "@/lib/nav-icons";
import { cn } from "@/lib/utils";

type DashboardNavLinksProps = {
  items: DashboardNavItem[];
  onNavigate?: () => void;
  className?: string;
  variant?: "default" | "nested";
};

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardNavLinks({
  items,
  onNavigate,
  className,
  variant = "default",
}: DashboardNavLinksProps) {
  const pathname = usePathname();
  const nested = variant === "nested";

  return (
    <nav className={cn("flex flex-col gap-0.5", className)}>
      {items.map((item) => {
        const active = isActive(pathname, item.href, item.exact);
        const Icon = navIcons[item.icon];

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg font-medium transition-colors",
              nested ? "py-1.5 pl-9 pr-3 text-xs" : "px-3 py-2 text-sm",
              active
                ? nested
                  ? "bg-primary/10 text-primary"
                  : "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {!nested && <Icon className="size-4 shrink-0" />}
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
