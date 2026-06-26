export function getUserLabel(name: string | null | undefined, email: string) {
  return name?.trim() || email;
}

export function getUserInitials(
  name: string | null | undefined,
  email: string,
) {
  const label = getUserLabel(name, email);
  const parts = label.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return label.slice(0, 2).toUpperCase();
}
