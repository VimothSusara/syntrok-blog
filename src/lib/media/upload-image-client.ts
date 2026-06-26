import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/media/constants";

type SignedUploadParams = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  public_id?: string;
  error?: { message?: string };
};

export function validateImageFile(file: File) {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
    )
  ) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 5 MB or smaller.");
  }
}

async function getSignedParams(): Promise<SignedUploadParams> {
  const res = await fetch("/api/upload/sign", { method: "POST" });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? "Failed to get upload signature.");
  }
  return res.json();
}

/** Direct browser → Cloudinary signed upload (for Tiptap) */
export async function uploadImageToCloudinary(file: File) {
  validateImageFile(file);

  const sign = await getSignedParams();
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", sign.apiKey);
  body.append("timestamp", String(sign.timestamp));
  body.append("signature", sign.signature);
  body.append("folder", sign.folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
    { method: "POST", body },
  );

  const data = (await res.json()) as CloudinaryUploadResponse;
  if (!res.ok || !data.secure_url || !data.public_id) {
    throw new Error(data.error?.message ?? "Upload failed.");
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}
