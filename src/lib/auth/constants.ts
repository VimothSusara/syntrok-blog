export const ROLES = {
  USER: "USER",
  SUPERADMIN: "SUPERADMIN",
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];
