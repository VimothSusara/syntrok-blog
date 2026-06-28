"use server";

import { revalidatePath } from "next/cache";
import {
  AuditAction,
  AuditEntityType,
  UserRole,
} from "../../../../../generated/prisma/client";
import { logAudit } from "@/lib/audit/log-audit";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isSuperAdmin } from "@/lib/auth/permissions";
import {
  banUser,
  getUserForAdminAction,
  reactivateUser,
  suspendUser,
  updateUserRole,
  UserAdminError,
} from "@/lib/db/users-admin";

async function requireSuperAdmin() {
  const user = await getCurrentUser();
  if (!user || !isSuperAdmin(user)) return null;
  return user;
}

function assertNotSelf(adminId: string, targetUserId: string) {
  if (adminId === targetUserId) {
    throw new UserAdminError("You cannot modify your own account.");
  }
}

export type UserAdminActionResult = {
  error?: string;
  success?: string;
};

export async function suspendUserAction(
  userId: string,
  reason?: string,
): Promise<UserAdminActionResult> {
  const admin = await requireSuperAdmin();
  if (!admin) return { error: "Unauthorized." };

  try {
    assertNotSelf(admin.id, userId);

    const existing = await getUserForAdminAction(userId);
    if (!existing) return { error: "User not found." };

    const updated = await suspendUser(userId, reason);

    await logAudit({
      action: AuditAction.USER_SUSPENDED,
      entityType: AuditEntityType.USER,
      entityId: updated.id,
      actorUserId: admin.id,
      targetUserId: updated.id,
      metadata: {
        from: existing.status,
        to: updated.status,
        reason: reason?.trim() || null,
      },
    });

    revalidatePath("/dashboard/admin/users");
    return { success: "User suspended." };
  } catch (error) {
    if (error instanceof UserAdminError) return { error: error.message };
    return { error: "Could not suspend user." };
  }
}

export async function banUserAction(
  userId: string,
  reason?: string,
): Promise<UserAdminActionResult> {
  const admin = await requireSuperAdmin();
  if (!admin) return { error: "Unauthorized." };

  try {
    assertNotSelf(admin.id, userId);

    const existing = await getUserForAdminAction(userId);
    if (!existing) return { error: "User not found." };

    const updated = await banUser(userId, reason);

    await logAudit({
      action: AuditAction.USER_BANNED,
      entityType: AuditEntityType.USER,
      entityId: updated.id,
      actorUserId: admin.id,
      targetUserId: updated.id,
      metadata: {
        from: existing.status,
        to: updated.status,
        reason: reason?.trim() || null,
      },
    });

    revalidatePath("/dashboard/admin/users");
    return { success: "User banned." };
  } catch (error) {
    if (error instanceof UserAdminError) return { error: error.message };
    return { error: "Could not ban user." };
  }
}

export async function reactivateUserAction(
  userId: string,
): Promise<UserAdminActionResult> {
  const admin = await requireSuperAdmin();
  if (!admin) return { error: "Unauthorized." };

  try {
    assertNotSelf(admin.id, userId);

    const existing = await getUserForAdminAction(userId);
    if (!existing) return { error: "User not found." };

    const updated = await reactivateUser(userId);

    await logAudit({
      action: AuditAction.USER_REACTIVATED,
      entityType: AuditEntityType.USER,
      entityId: updated.id,
      actorUserId: admin.id,
      targetUserId: updated.id,
      metadata: {
        from: existing.status,
        to: updated.status,
      },
    });

    revalidatePath("/dashboard/admin/users");
    return { success: "User reactivated." };
  } catch (error) {
    if (error instanceof UserAdminError) return { error: error.message };
    return { error: "Could not reactivate user." };
  }
}

export async function changeUserRoleAction(
  userId: string,
  role: "USER" | "SUPERADMIN",
): Promise<UserAdminActionResult> {
  const admin = await requireSuperAdmin();
  if (!admin) return { error: "Unauthorized." };

  try {
    assertNotSelf(admin.id, userId);

    const existing = await getUserForAdminAction(userId);
    if (!existing) return { error: "User not found." };

    if (existing.role === role) {
      return { success: "Role unchanged." };
    }

    const updated = await updateUserRole(
      userId,
      role === "SUPERADMIN" ? UserRole.SUPERADMIN : UserRole.USER,
    );

    await logAudit({
      action: AuditAction.USER_ROLE_CHANGED,
      entityType: AuditEntityType.USER,
      entityId: updated.id,
      actorUserId: admin.id,
      targetUserId: updated.id,
      metadata: {
        from: existing.role,
        to: updated.role,
      },
    });

    revalidatePath("/dashboard/admin/users");
    return {
      success:
        role === "SUPERADMIN"
          ? "User promoted to superadmin."
          : "User role set to user.",
    };
  } catch (error) {
    if (error instanceof UserAdminError) return { error: error.message };
    return { error: "Could not change user role." };
  }
}
