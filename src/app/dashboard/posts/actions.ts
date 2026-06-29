"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createPost,
  getPostById,
  isSlugTaken,
  softDeletePost,
  updatePost,
  updatePostStatus,
} from "@/lib/db/posts";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { canEditPost } from "@/lib/auth/permissions";
import { slugify } from "@/lib/utils";
import { parsePostForm } from "@/lib/validations/post";
import {
  deleteAllPostImages,
  deleteRemovedPostImages,
} from "@/lib/media/delete-cloudinary-assets";
import {
  PostStatus,
  AuditAction,
  AuditEntityType,
} from "../../../../generated/prisma/client";
import { logAudit } from "@/lib/audit/log-audit";
import { isProfileComplete } from "@/lib/auth/profile";
import { indexPostEmbeddings } from "@/lib/ai/runtime/index-post-embeddings";

export type PostActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const ALLOWED_STATUS_CHANGES: PostStatus[] = [
  PostStatus.DRAFT,
  PostStatus.PUBLISHED,
  PostStatus.ARCHIVED,
];

function requireProfileToPublish(
  user: { username: string | null },
  nextStatus: PostStatus,
) {
  if (nextStatus === PostStatus.PUBLISHED && !isProfileComplete(user)) {
    return "Set a username in onboarding before publishing.";
  }
  return null;
}

function postAuditTargetUserId(
  actorId: string,
  authorId: string,
): string | undefined {
  return actorId !== authorId ? authorId : undefined;
}

function auditActionForStatusChange(
  previous: PostStatus,
  next: PostStatus,
): AuditAction {
  if (next === PostStatus.PUBLISHED) return AuditAction.POST_PUBLISHED;
  if (
    previous === PostStatus.PUBLISHED &&
    (next === PostStatus.DRAFT || next === PostStatus.ARCHIVED)
  ) {
    return AuditAction.POST_UNPUBLISHED;
  }
  return AuditAction.POST_UPDATED;
}

export async function createPostAction(
  _prev: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in." };

  const parsed = parsePostForm(formData);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Please fix the errors below.",
    };
  }

  const data = parsed.data;

  const publishError = requireProfileToPublish(user, data.status);
  if (publishError) return { error: publishError };

  const slug = data.slug || slugify(data.title);

  if (await isSlugTaken(slug)) {
    return { error: "That slug is already taken. Choose another." };
  }

  const post = await createPost(user.id, { ...data, slug });

  if (post.status === PostStatus.PUBLISHED) {
    await indexPostEmbeddings(post.id, post.contentPlain ?? "");
  }

  await logAudit({
    action: AuditAction.POST_CREATED,
    entityType: AuditEntityType.POST,
    entityId: post.id,
    actorUserId: user.id,
    metadata: {
      slug: post.slug,
      title: post.title,
      status: post.status,
    },
  });

  if (post.status === PostStatus.PUBLISHED) {
    await logAudit({
      action: AuditAction.POST_PUBLISHED,
      entityType: AuditEntityType.POST,
      entityId: post.id,
      actorUserId: user.id,
      metadata: { slug: post.slug, title: post.title },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/posts");
  revalidatePath("/posts");

  redirect(`/dashboard/posts/${post.id}/edit`);
}

export async function updatePostAction(
  postId: string,
  _prev: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in." };

  const post = await getPostById(postId);
  if (!post || !canEditPost(user, post)) {
    return { error: "You do not have permission to edit this post." };
  }

  const parsed = parsePostForm(formData);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Please fix the errors below.",
    };
  }

  const data = parsed.data;
  const slug = data.slug || slugify(data.title);

  const publishError = requireProfileToPublish(user, data.status);
  if (publishError) return { error: publishError };

  if (await isSlugTaken(slug, postId)) {
    return { error: "That slug is already taken. Choose another." };
  }

  await deleteRemovedPostImages(
    {
      coverImagePublicId: post.coverImagePublicId,
      coverImageUrl: post.coverImageUrl,
      content: post.content,
    },
    {
      coverImagePublicId: data.coverImagePublicId,
      coverImageUrl: data.coverImageUrl,
      content: data.content,
    },
  );

  const updatedPost = await updatePost(postId, { ...data, slug });
  if (!updatedPost) return { error: "Failed to update post." };

  if (updatedPost.status === PostStatus.PUBLISHED) {
    await indexPostEmbeddings(updatedPost.id, updatedPost.contentPlain ?? "");
  }

  const statusChanged = post.status !== updatedPost.status;

  await logAudit({
    action: AuditAction.POST_UPDATED,
    entityType: AuditEntityType.POST,
    entityId: updatedPost.id,
    actorUserId: user.id,
    targetUserId: postAuditTargetUserId(user.id, post.authorId),
    metadata: {
      slug: updatedPost.slug,
      title: updatedPost.title,
      previousStatus: post.status,
      newStatus: updatedPost.status,
      previousSlug: post.slug,
    },
  });

  if (statusChanged) {
    await logAudit({
      action: auditActionForStatusChange(post.status, updatedPost.status),
      entityType: AuditEntityType.POST,
      entityId: updatedPost.id,
      actorUserId: user.id,
      targetUserId: postAuditTargetUserId(user.id, post.authorId),
      metadata: {
        from: post.status,
        to: updatedPost.status,
        slug: updatedPost.slug,
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/posts");
  revalidatePath(`/dashboard/posts/${postId}/edit`);
  revalidatePath("/posts");
  revalidatePath(`/posts/${slug}`);

  return {};
}

export async function deletePostAction(postId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const post = await getPostById(postId);
  if (!post || !canEditPost(user, post)) throw new Error("Forbidden");

  await deleteAllPostImages({
    coverImagePublicId: post.coverImagePublicId,
    coverImageUrl: post.coverImageUrl,
    content: post.content,
  });

  await softDeletePost(postId);

  await logAudit({
    action: AuditAction.POST_DELETED,
    entityType: AuditEntityType.POST,
    entityId: post.id,
    actorUserId: user.id,
    targetUserId: postAuditTargetUserId(user.id, post.authorId),
    metadata: {
      slug: post.slug,
      title: post.title,
      status: post.status,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/posts");
  revalidatePath("/posts");

  redirect("/dashboard/posts");
}

export async function updatePostStatusAction(
  postId: string,
  status: PostStatus,
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  if (!ALLOWED_STATUS_CHANGES.includes(status)) {
    throw new Error("Invalid status");
  }
  const post = await getPostById(postId);
  if (!post || !canEditPost(user, post)) throw new Error("Forbidden");
  if (post.status === PostStatus.DELETED) {
    throw new Error("Cannot change status of a deleted post");
  }

  const publishError = requireProfileToPublish(user, status);
  if (publishError) throw new Error(publishError);

  const updated = await updatePostStatus(postId, status);
  if (!updated) throw new Error("Post not found");

  if (status === PostStatus.PUBLISHED) {
    await indexPostEmbeddings(updated.id, updated.contentPlain ?? "");
  }

  await logAudit({
    action: auditActionForStatusChange(post.status, status),
    entityType: AuditEntityType.POST,
    entityId: updated.id,
    actorUserId: user.id,
    targetUserId: postAuditTargetUserId(user.id, post.authorId),
    metadata: {
      from: post.status,
      to: status,
      slug: updated.slug,
      title: updated.title,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/posts");
  revalidatePath(`/dashboard/posts/${postId}/edit`);
  revalidatePath("/posts");
  revalidatePath(`/posts/${updated.slug}`);
}
