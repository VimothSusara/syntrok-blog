"use client";

import Link from "next/link";
import { useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import type { CommentAdminRow } from "@/lib/types/comment-admin";
import {
  approveCommentAction,
  deleteCommentAction,
  markCommentSpamAction,
  rejectCommentAction,
} from "@/app/dashboard/admin/comments/actions";
import { Button } from "@/components/ui/button";
import { getDisplayName } from "@/lib/users/display";

type CommentsAdminTableProps = {
  rows: CommentAdminRow[];
};

export function CommentsAdminTable({ rows }: CommentsAdminTableProps) {
  const [pending, startTransition] = useTransition();

  const run = (action: () => Promise<void>) => {
    startTransition(async () => {
      await action();
    });
  };

  if (!rows.length) {
    return (
      <p className="rounded-xl border border-border p-6 text-sm text-muted-foreground">
        No comments found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="min-w-full text-sm">
        <thead className="border-b border-border bg-muted/30 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Comment</th>
            <th className="px-4 py-3 font-medium">Author</th>
            <th className="px-4 py-3 font-medium">Post</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isPublic = row.status === "APPROVED";

            return (
              <tr
                key={row.id}
                className="border-b border-border align-top last:border-0"
              >
                <td className="max-w-md px-4 py-3">
                  <p className="line-clamp-4 whitespace-pre-wrap">
                    {row.content}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {row.parentId ? "Reply · " : ""}
                    {formatDistanceToNow(row.createdAt, { addSuffix: true })}
                  </p>
                </td>
                <td className="px-4 py-3">
                  {getDisplayName(row.user)}
                  {row.user.username ? (
                    <p className="text-xs text-muted-foreground">
                      @{row.user.username}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/posts/${row.post.slug}`}
                    className="font-medium hover:text-primary"
                  >
                    {row.post.title}
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize">
                  {row.status.toLowerCase()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {isPublic && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={pending}
                          onClick={() => run(() => rejectCommentAction(row.id))}
                        >
                          Hide
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={pending}
                          onClick={() =>
                            run(() => markCommentSpamAction(row.id))
                          }
                        >
                          Spam
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={pending}
                          onClick={() => run(() => deleteCommentAction(row.id))}
                        >
                          Delete
                        </Button>
                      </>
                    )}

                    {!isPublic && row.status !== "DELETED" && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={pending}
                          onClick={() =>
                            run(() => approveCommentAction(row.id))
                          }
                        >
                          Restore
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={pending}
                          onClick={() => run(() => deleteCommentAction(row.id))}
                        >
                          Delete
                        </Button>
                      </>
                    )}

                    {row.status === "DELETED" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={pending}
                        onClick={() => run(() => approveCommentAction(row.id))}
                      >
                        Restore
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
