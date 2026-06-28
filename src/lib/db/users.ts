import { prisma } from "@/lib/prisma";

export async function isUsernameTaken(
  username: string,
  excludeUserId?: string,
) {
  const existing = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!existing) return false;
  if (excludeUserId && existing.id === excludeUserId) return false;
  return true;
}

export async function updateUserProfile(
  userId: string,
  input: { username: string; bio?: string },
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      username: input.username.trim(),
      bio: input.bio?.trim() || null,
    },
    select: {
      id: true,
      username: true,
      bio: true,
      name: true,
      email: true,
    },
  });
}
