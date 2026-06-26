/**
 * Fallback: derive public_id from a Cloudinary delivery URL when public_id
 * was not stored at upload time (legacy posts). Prefer storing publicId in
 * Tiptap image attrs and coverImagePublicId on Post.
 */
export function publicIdFromCloudinaryUrl(url: string): string | null {
  if (!url.includes("res.cloudinary.com")) return null;

  try {
    const uploadMarker = "/upload/";
    const uploadIndex = url.indexOf(uploadMarker);
    if (uploadIndex === -1) return null;

    const path = url.slice(uploadIndex + uploadMarker.length).split("?")[0] ?? "";
    const segments = path.split("/").filter(Boolean);

    while (segments.length > 0) {
      const segment = segments[0]!;

      if (/^v\d+$/.test(segment)) {
        segments.shift();
        break;
      }

      if (segment.includes(",") || /^[a-z0-9]+_[a-z0-9]/i.test(segment)) {
        segments.shift();
        continue;
      }

      break;
    }

    if (segments.length === 0) return null;

    const publicIdWithExt = segments.join("/");
    return publicIdWithExt.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}
