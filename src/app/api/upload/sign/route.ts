import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createSignedUploadParams } from "@/lib/media/cloudinary";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const params = createSignedUploadParams(user.id);
    return NextResponse.json(params);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to sign upload";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
