import type { NavIconKey } from "@/lib/nav-icons";

export type DashboardNavItem = {
  title: string;
  href: string;
  icon: NavIconKey;
  exact?: boolean;
  superAdminOnly?: boolean;
};

export const dashboardNavItems: DashboardNavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: "layout-dashboard",
    exact: true,
  },
  {
    title: "My posts",
    href: "/dashboard/posts",
    icon: "file-text",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "settings",
  },
  {
    title: "Admin",
    href: "/dashboard/admin",
    icon: "shield",
    exact: true,
    superAdminOnly: true,
  },
];

export function getDashboardNav(isSuperAdmin: boolean) {
  return dashboardNavItems.filter(
    (item) => !item.superAdminOnly || isSuperAdmin,
  );
}
