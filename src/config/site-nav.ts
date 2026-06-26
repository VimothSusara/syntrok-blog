export type SiteNavItem = {
  title: string;
  href: string;
  exact?: boolean;
};

export const siteNavItems: SiteNavItem[] = [
  { title: "Home", href: "/", exact: true },
  { title: "Posts", href: "/posts" },
];
