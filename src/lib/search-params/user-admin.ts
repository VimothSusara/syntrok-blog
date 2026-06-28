import { ADMIN_PAGE_SIZE, parsePage } from "@/lib/pagination";

export const USER_ADMIN_STATUSES = [
  "all",
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "BANNED",
  "DELETED",
] as const;

export const USER_ADMIN_ROLES = ["all", "USER", "SUPERADMIN"] as const;

export type UserAdminStatusFilter = (typeof USER_ADMIN_STATUSES)[number];
export type UserAdminRoleFilter = (typeof USER_ADMIN_ROLES)[number];

export type UserModerationStatus = Exclude<UserAdminStatusFilter, "all">;
export type UserModerationRole = Exclude<UserAdminRoleFilter, "all">;

export type UserAdminFilters = {
  q?: string;
  status: UserAdminStatusFilter;
  role: UserAdminRoleFilter;
  page: number;
  pageSize: number;
};

const STATUS_SET = new Set<string>(USER_ADMIN_STATUSES);
const ROLE_SET = new Set<string>(USER_ADMIN_ROLES);

export function parseUserAdminFilters(
  raw: Record<string, string | string[] | undefined>,
): UserAdminFilters {
  const q = typeof raw.q === "string" ? raw.q.trim() : undefined;
  const statusRaw = typeof raw.status === "string" ? raw.status : "all";
  const roleRaw = typeof raw.role === "string" ? raw.role : "all";

  return {
    q: q || undefined,
    status: STATUS_SET.has(statusRaw)
      ? (statusRaw as UserAdminStatusFilter)
      : "all",
    role: ROLE_SET.has(roleRaw) ? (roleRaw as UserAdminRoleFilter) : "all",
    page: parsePage(typeof raw.page === "string" ? raw.page : undefined),
    pageSize: ADMIN_PAGE_SIZE,
  };
}

export function userAdminFiltersToParams(filters: UserAdminFilters) {
  return {
    q: filters.q,
    status: filters.status !== "all" ? filters.status : undefined,
    role: filters.role !== "all" ? filters.role : undefined,
    page: filters.page > 1 ? String(filters.page) : undefined,
  };
}
