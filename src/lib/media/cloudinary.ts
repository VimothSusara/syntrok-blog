import "server-only";

import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryUploadFolder } from "@/lib/media/upload-folder";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function assertCloudinaryConfigured() {
  if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary is not configured");
  }
}

/** For Tiptap programmatic uploads */
export function createSignedUploadParams(userId: string) {
  assertCloudinaryConfigured();

  const folder = getCloudinaryUploadFolder(userId);
  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    timestamp,
    signature,
    folder,
  };
}

/** For next-cloudinary CldUploadWidget */
export function signWidgetParams(
  paramsToSign: Record<string, string | number>,
) {
  assertCloudinaryConfigured();

  return cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!,
  );
}

export async function destroyCloudinaryImage(publicId: string) {
  assertCloudinaryConfigured();
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}
