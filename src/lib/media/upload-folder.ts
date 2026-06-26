const ROOT_FOLDER =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER ?? "syntrok-blog";

export function getCloudinaryUploadFolder(userId: string) {
  return `${ROOT_FOLDER}/${userId}`;
}
