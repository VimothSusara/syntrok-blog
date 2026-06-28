"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import type { UserAdminRow } from "@/lib/types/user-admin";
import {
  changeUserRoleAction,
  reactivateUserAction,
} from "@/app/dashboard/admin/users/actions";
import { UserModerationDialog } from "@/components/dashboard/admin/user-moderation-dialog";
import { Button } from "@/components/ui/button";
import { getUserLabel } from "@/lib/user-display";
import { authorProfileUrl } from "@/lib/urls/authors";
import { authorPostsFilterUrl } from "@/lib/urls/public-posts";

type UsersAdminTableProps = {
  rows: UserAdminRow[];
  currentUserId: string;
};

export function UsersAdminTable({ rows, currentUserId }: UsersAdminTableProps) {
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<{
    open: boolean;
    mode: "suspend" | "ban";
    userId: string;
    userLabel: string;
  } | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const run = (action: () => Promise<{ error?: string; success?: string }>) => {
    startTransition(async () => {
      const result = await action();
      setMessage(result.error ?? result.success ?? null);
    });
  };

  if (!rows.length) {
    return (
      <p className="rounded-xl border border-border p-6 text-sm text-muted-foreground">
        No users found.
      </p>
    );
  }

  return (
    <>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Activity</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const label = getUserLabel(row.name, row.email);
              const isSelf = row.id === currentUserId;
              const profileHref = authorProfileUrl(row);
              const postsHref = authorPostsFilterUrl(row);

              return (
                <tr
                  key={row.id}
                  className="border-b border-border align-top last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {profileHref ? (
                        <Link
                          href={profileHref}
                          className="font-medium hover:text-primary"
                        >
                          {label}
                        </Link>
                      ) : (
                        <p className="font-medium">{label}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {row.email}
                      </p>
                      {row.username ? (
                        <p className="text-xs text-muted-foreground">
                          @{row.username}
                        </p>
                      ) : null}
                      <p className="text-xs text-muted-foreground">
                        Joined{" "}
                        {formatDistanceToNow(row.createdAt, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {row.role.toLowerCase()}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {row.status.toLowerCase()}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={postsHref} className="block hover:text-primary">
                      {row._count.posts} posts
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {row._count.comments} comments
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {isSelf ? (
                      <p className="text-xs text-muted-foreground">
                        This is you
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {row.status === "ACTIVE" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={pending}
                              onClick={() =>
                                setDialog({
                                  open: true,
                                  mode: "suspend",
                                  userId: row.id,
                                  userLabel: label,
                                })
                              }
                            >
                              Suspend
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={pending}
                              onClick={() =>
                                setDialog({
                                  open: true,
                                  mode: "ban",
                                  userId: row.id,
                                  userLabel: label,
                                })
                              }
                            >
                              Ban
                            </Button>
                          </>
                        )}

                        {(row.status === "SUSPENDED" ||
                          row.status === "BANNED" ||
                          row.status === "INACTIVE") && (
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={pending}
                            onClick={() =>
                              run(() => reactivateUserAction(row.id))
                            }
                          >
                            Reactivate
                          </Button>
                        )}

                        {row.role === "USER" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={pending}
                            onClick={() =>
                              run(() =>
                                changeUserRoleAction(row.id, "SUPERADMIN"),
                              )
                            }
                          >
                            Make superadmin
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={pending}
                            onClick={() =>
                              run(() => changeUserRoleAction(row.id, "USER"))
                            }
                          >
                            Make user
                          </Button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {dialog && (
        <UserModerationDialog
          open={dialog.open}
          onOpenChange={(open) =>
            setDialog((current) => (current ? { ...current, open } : current))
          }
          userId={dialog.userId}
          userLabel={dialog.userLabel}
          mode={dialog.mode}
          onComplete={(result) =>
            setMessage(result.error ?? result.success ?? null)
          }
        />
      )}
    </>
  );
}
