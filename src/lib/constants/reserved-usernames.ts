export const RESERVED_USERNAMES = new Set([
  "admin",
  "api",
  "authors",
  "blog",
  "contact",
  "dashboard",
  "help",
  "login",
  "posts",
  "privacy",
  "settings",
  "sign-in",
  "sign-up",
  "signup",
  "signin",
  "terms",
  "www",
]);

export function isReservedUsername(username: string) {
  return RESERVED_USERNAMES.has(username.toLowerCase());
}
