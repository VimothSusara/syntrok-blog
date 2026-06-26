import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getCloudinaryUploadFolder } from "@/lib/media/upload-folder";
import { signWidgetParams } from "@/lib/media/cloudinary";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      paramsToSign?: Record<string, string | number>;
    };

    const paramsToSign = {
      ...body.paramsToSign,
      folder: getCloudinaryUploadFolder(user.id),
    };

    const signature = signWidgetParams(paramsToSign);
    return NextResponse.json({ signature });
  } catch {
    return NextResponse.json(
      { error: "Failed to sign upload" },
      { status: 500 },
    );
  }
}
