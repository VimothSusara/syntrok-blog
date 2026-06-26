import { auth, currentUser } from "@clerk/nextjs/server";
import type { User } from "../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { ROLES, type AppRole } from "@/lib/auth/constants";

function resolveRole(metadata: unknown): AppRole {
  const role = (metadata as { role?: string } | undefined)?.role;
  return role === ROLES.SUPERADMIN ? ROLES.SUPERADMIN : ROLES.USER;
}

export async function getCurrentUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (existing) return existing;

  // Dev fallback if webhook hasn't fired yet
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  return prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      email,
      name: clerkUser.fullName,
      imageUrl: clerkUser.imageUrl,
      lastLoginAt: new Date(),
    },
    create: {
      clerkId: userId,
      email,
      name: clerkUser.fullName,
      imageUrl: clerkUser.imageUrl,
      role: resolveRole(clerkUser.publicMetadata),
    },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireSuperAdmin() {
  const user = await requireUser();
  if (user.role !== "SUPERADMIN") throw new Error("Forbidden");
  return user;
}
