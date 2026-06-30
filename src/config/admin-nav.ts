import type { NavIconKey } from "@/lib/nav-icons";
import type { DashboardNavItem } from "@/config/dashboard-nav";

export type AdminNavItem = {
  title: string;
  href: string;
  icon: NavIconKey;
  exact?: boolean;
};

export const adminNavItems: AdminNavItem[] = [
  {
    title: "Overview",
    href: "/dashboard/admin",
    icon: "layout-dashboard",
    exact: true,
  },
  {
    title: "Categories",
    href: "/dashboard/admin/categories",
    icon: "folder",
  },
  {
    title: "Tags",
    href: "/dashboard/admin/tags",
    icon: "tags",
  },
  {
    title: "Users",
    href: "/dashboard/admin/users",
    icon: "users",
  },
  {
    title: "Comments",
    href: "/dashboard/admin/comments",
    icon: "message-square",
  },
  {
    title: "Reports",
    href: "/dashboard/admin/reports",
    icon: "scroll-text",
  },
  {
    title: "AI config",
    href: "/dashboard/admin/ai",
    icon: "bot",
  },
  {
    title: "Audit logs",
    href: "/dashboard/admin/audit",
    icon: "scroll-text",
  },
];

export function adminNavItemsAsDashboard(): DashboardNavItem[] {
  return adminNavItems.map((item) => ({
    title: item.title,
    href: item.href,
    icon: item.icon,
    exact: item.exact,
  }));
}
