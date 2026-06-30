export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function truncateBreadcrumbLabel(label: string, max = 48) {
  const trimmed = label.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trimEnd()}…`;
}

export const publicBreadcrumbs = {
  posts: (): BreadcrumbItem[] => [
    { label: "Home", href: "/" },
    { label: "Posts" },
  ],

  post: (title: string): BreadcrumbItem[] => [
    { label: "Home", href: "/" },
    { label: "Posts", href: "/posts" },
    { label: truncateBreadcrumbLabel(title) },
  ],

  author: (displayName: string): BreadcrumbItem[] => [
    { label: "Home", href: "/" },
    { label: "Authors", href: "/posts" },
    { label: displayName },
  ],

  legal: (title: string): BreadcrumbItem[] => [
    { label: "Home", href: "/" },
    { label: title },
  ],
};

export const dashboardBreadcrumbs = {
  overview: (): BreadcrumbItem[] => [{ label: "Dashboard" }],

  myPosts: (): BreadcrumbItem[] => [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My posts" },
  ],

  newPost: (): BreadcrumbItem[] => [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My posts", href: "/dashboard/posts" },
    { label: "New post" },
  ],

  editPost: (title?: string): BreadcrumbItem[] => [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My posts", href: "/dashboard/posts" },
    { label: title ? truncateBreadcrumbLabel(title) : "Edit post" },
  ],

  saved: (): BreadcrumbItem[] => [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Saved posts" },
  ],

  settings: (): BreadcrumbItem[] => [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Settings" },
  ],
};

export const adminBreadcrumbs = {
  overview: (): BreadcrumbItem[] => [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Administration" },
  ],

  section: (title: string): BreadcrumbItem[] => [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Administration", href: "/dashboard/admin" },
    { label: title },
  ],
};
