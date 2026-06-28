import type { LucideIcon } from "lucide-react";
import {
  ScrollText,
  Bot,
  FileText,
  Home,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Settings,
  Shield,
  Users,
  Folder,
  Tags,
  Bookmark,
} from "lucide-react";

export const navIconKeys = [
  "home",
  "newspaper",
  "layout-dashboard",
  "file-text",
  "settings",
  "shield",
  "users",
  "message-square",
  "bot",
  "scroll-text",
  "folder",
  "tags",
  "bookmark",
] as const;

export type NavIconKey = (typeof navIconKeys)[number];

export const navIcons: Record<NavIconKey, LucideIcon> = {
  home: Home,
  newspaper: Newspaper,
  "layout-dashboard": LayoutDashboard,
  "file-text": FileText,
  settings: Settings,
  shield: Shield,
  users: Users,
  "message-square": MessageSquare,
  bot: Bot,
  "scroll-text": ScrollText,
  folder: Folder,
  tags: Tags,
  bookmark: Bookmark,
};
