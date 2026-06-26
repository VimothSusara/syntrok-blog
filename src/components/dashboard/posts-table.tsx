import Link from "next/link";
import type { Post } from "../../../generated/prisma/client";
import { PostStatusBadge } from "@/components/dashboard/post-status-badge";
import { PostDeleteDialog } from "@/components/dashboard/post-delete-dialog";
import { PostStatusActions } from "@/components/dashboard/post-status-actions";
import { Button } from "@/components/ui/button";

export function PostsTable({ posts }: { posts: Post[] }) {
  if (!posts.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No posts yet.{" "}
        <Link
          href="/dashboard/posts/new"
          className="text-primary hover:underline"
        >
          Create your first post
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/40 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Visibility</th>
            <th className="px-4 py-3 font-medium">Views</th>
            <th className="px-4 py-3 font-medium">Updated</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <div className="font-medium">{post.title}</div>
                <div className="text-xs text-muted-foreground">
                  /{post.slug}
                </div>
              </td>
              <td className="px-4 py-3">
                <PostStatusBadge status={post.status} />
              </td>
              <td className="px-4 py-3">
                <PostStatusActions postId={post.id} status={post.status} />
              </td>
              <td className="px-4 py-3">{post.viewCount}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {post.updatedAt.toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/posts/${post.id}/edit`}>Edit</Link>
                  </Button>
                  {post.status === "PUBLISHED" && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/posts/${post.slug}`} target="_blank">
                        View
                      </Link>
                    </Button>
                  )}
                  {post.status !== "DELETED" && (
                    <PostDeleteDialog
                      postId={post.id}
                      title={post.title}
                      slug={post.slug}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
