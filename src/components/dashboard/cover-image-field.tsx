"use client";

import { useState } from "react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { getCloudinaryUploadFolder } from "@/lib/media/upload-folder";

type CoverImageFieldProps = {
  userId: string;
  defaultUrl?: string | null;
  defaultPublicId?: string | null;
};

export function CoverImageField({
  userId,
  defaultUrl,
  defaultPublicId,
}: CoverImageFieldProps) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [publicId, setPublicId] = useState(defaultPublicId ?? "");

  const clear = () => {
    setUrl("");
    setPublicId("");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium">Cover image</label>
        <div className="flex gap-2">
          <CldUploadWidget
            signatureEndpoint="/api/sign-cloudinary-params"
            onSuccess={(result) => {
              if (
                result.info &&
                typeof result.info === "object" &&
                "secure_url" in result.info
              ) {
                setUrl(result.info.secure_url);
                setPublicId(result.info.public_id);
              }
            }}
            options={{
              sources: ["local"],
              multiple: false,
              maxFileSize: 5_000_000,
              folder: getCloudinaryUploadFolder(userId),
            }}
          >
            {({ open }) => (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => open()}
              >
                {url ? "Replace" : "Upload"}
              </Button>
            )}
          </CldUploadWidget>
          {url && (
            <Button type="button" variant="ghost" size="sm" onClick={clear}>
              Remove
            </Button>
          )}
        </div>
      </div>

      <input type="hidden" name="coverImageUrl" value={url} />
      <input type="hidden" name="coverImagePublicId" value={publicId} />

      {url ? (
        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg border border-border">
          <CldImage
            src={url}
            alt="Cover preview"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Optional hero image for listings and social previews.
        </p>
      )}
    </div>
  );
}
