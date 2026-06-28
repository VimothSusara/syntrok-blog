import {
  UserRole,
  UserStatus,
  type Prisma,
} from "../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { buildPaginationMeta, getSkip } from "@/lib/pagination";
import type { UserAdminFilters } from "@/lib/search-params/user-admin";
import type { UserAdminRow } from "@/lib/types/user-admin";

export class UserAdminError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserAdminError";
  }
}

function buildUserAdminWhere(filters: UserAdminFilters): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {};

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { email: { contains: filters.q, mode: "insensitive" } },
      { username: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  if (filters.status !== "all") {
    where.status = filters.status as UserStatus;
  }

  if (filters.role !== "all") {
    where.role = filters.role as UserRole;
  }

  return where;
}

export async function getUsersPaginated(filters: UserAdminFilters) {
  const where = buildUserAdminWhere(filters);
  const skip = getSkip(filters.page, filters.pageSize);

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      skip,
      take: filters.pageSize,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        imageUrl: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        suspendedAt: true,
        bannedAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items: items as UserAdminRow[],
    total,
    pagination: buildPaginationMeta(filters.page, filters.pageSize, total),
  };
}

export async function getUserForAdminAction(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      role: true,
      status: true,
    },
  });
}

export async function suspendUser(userId: string, reason?: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      status: UserStatus.SUSPENDED,
      suspendedAt: new Date(),
      suspendedReason: reason?.trim() || null,
      bannedAt: null,
      bannedReason: null,
    },
    select: { id: true, email: true, status: true, role: true },
  });
}

export async function banUser(userId: string, reason?: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      status: UserStatus.BANNED,
      bannedAt: new Date(),
      bannedReason: reason?.trim() || null,
      suspendedAt: null,
      suspendedReason: null,
    },
    select: { id: true, email: true, status: true, role: true },
  });
}

export async function reactivateUser(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      status: UserStatus.ACTIVE,
      suspendedAt: null,
      suspendedReason: null,
      bannedAt: null,
      bannedReason: null,
    },
    select: { id: true, email: true, status: true, role: true },
  });
}

export async function updateUserRole(userId: string, role: UserRole) {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, email: true, status: true, role: true },
  });
}
