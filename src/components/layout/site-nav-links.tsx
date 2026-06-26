"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteNavItems } from "@/config/site-nav";
import { cn } from "@/lib/utils";

type SiteNavLinksProps = {
  onNavigate?: () => void;
  className?: string;
  orientation?: "horizontal" | "vertical";
};

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavLinks({
  onNavigate,
  className,
  orientation = "horizontal",
}: SiteNavLinksProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        orientation === "horizontal"
          ? "flex items-center gap-4"
          : "flex flex-col gap-2",
        className,
      )}
    >
      {siteNavItems.map((item) => {
        const active = isActive(pathname, item.href, item.exact);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "text-sm font-medium transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
