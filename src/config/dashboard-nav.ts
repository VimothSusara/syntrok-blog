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
    title: "Saved posts",
    href: "/dashboard/saved",
    icon: "bookmark",
  },
  {
    title: "Following",
    href: "/posts?following=1",
    icon: "users",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "settings",
  },
];

export function getDashboardNav(isSuperAdmin: boolean) {
  return dashboardNavItems.filter(
    (item) => !item.superAdminOnly || isSuperAdmin,
  );
}
