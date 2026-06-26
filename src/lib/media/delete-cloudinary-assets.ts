import "server-only";

import { extractImagePublicIdsFromTiptapContent } from "@/lib/posts/content";
import { publicIdFromCloudinaryUrl } from "@/lib/media/cloudinary-public-id";
import { destroyCloudinaryImage } from "@/lib/media/cloudinary";

type PostImageSource = {
  coverImagePublicId?: string | null;
  coverImageUrl?: string | null;
  content: string;
};

function coverPublicId(post: PostImageSource): string | null {
  if (post.coverImagePublicId?.trim()) {
    return post.coverImagePublicId.trim();
  }
  if (post.coverImageUrl?.trim()) {
    return publicIdFromCloudinaryUrl(post.coverImageUrl.trim());
  }
  return null;
}

function collectPostImagePublicIds(post: PostImageSource): Set<string> {
  const ids = new Set<string>();

  const cover = coverPublicId(post);
  if (cover) ids.add(cover);

  for (const id of extractImagePublicIdsFromTiptapContent(post.content)) {
    ids.add(id);
  }

  return ids;
}

export async function deleteCloudinaryAssets(publicIds: string[]) {
  const unique = [...new Set(publicIds.filter(Boolean))];

  await Promise.allSettled(unique.map((publicId) => destroyCloudinaryImage(publicId)));
}

/** Delete images removed during an edit (cover replaced or inline images removed). */
export async function deleteRemovedPostImages(
  before: PostImageSource,
  after: PostImageSource,
) {
  const beforeIds = collectPostImagePublicIds(before);
  const afterIds = collectPostImagePublicIds(after);
  const toDelete = [...beforeIds].filter((id) => !afterIds.has(id));

  if (toDelete.length > 0) {
    await deleteCloudinaryAssets(toDelete);
  }
}

/** Delete all images when a post is soft-deleted. */
export async function deleteAllPostImages(post: PostImageSource) {
  const ids = [...collectPostImagePublicIds(post)];
  if (ids.length > 0) {
    await deleteCloudinaryAssets(ids);
  }
}
