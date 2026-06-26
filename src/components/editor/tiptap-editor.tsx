"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import FileHandler from "@tiptap/extension-file-handler";
import { uploadImageToCloudinary } from "@/lib/media/upload-image-client";
import { ALLOWED_IMAGE_TYPES } from "@/lib/media/constants";
import { EditorToolbar } from "./editor-toolbar";
import { TiptapImage } from "./tiptap-image";
import { cn } from "@/lib/utils";

type TiptapEditorProps = {
  value: string;
  onChange: (json: string) => void;
  className?: string;
};

async function insertUploadedImage(
  editor: Editor,
  file: File,
  setError: (msg: string | null) => void,
  setUploading: (v: boolean) => void,
) {
  setError(null);
  setUploading(true);
  try {
    const { url, publicId } = await uploadImageToCloudinary(file);
    editor
      .chain()
      .focus()
      .insertContent({
        type: "image",
        attrs: { src: url, alt: file.name, publicId },
      })
      .run();
  } catch (err) {
    setError(err instanceof Error ? err.message : "Image upload failed.");
  } finally {
    setUploading(false);
  }
}

export function TiptapEditor({
  value,
  onChange,
  className,
}: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFiles = useCallback((editor: Editor, files: File[]) => {
    for (const file of files) {
      void insertUploadedImage(editor, file, setUploadError, setImageUploading);
    }
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class: "text-primary underline underline-offset-4",
          },
        },
      }),
      TiptapImage.configure({
        allowBase64: false,
        HTMLAttributes: { class: "my-4" },
      }),
      Placeholder.configure({
        placeholder: "Write your post…",
      }),
      FileHandler.configure({
        allowedMimeTypes: [...ALLOWED_IMAGE_TYPES],
        onDrop: (ed, files) => handleFiles(ed, files),
        onPaste: (ed, files) => handleFiles(ed, files),
      }),
    ],
    content: JSON.parse(value),
    editorProps: {
      attributes: {
        class:
          "tiptap prose-blog max-w-none min-h-[320px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(JSON.stringify(ed.getJSON()));
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = JSON.stringify(editor.getJSON());
    if (value !== current) {
      editor.commands.setContent(JSON.parse(value), { emitUpdate: false });
    }
  }, [editor, value]);

  const onPickImage = () => fileInputRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;
    void insertUploadedImage(editor, file, setUploadError, setImageUploading);
  };

  return (
    <div
      className={cn("rounded-md border border-input bg-background", className)}
    >
      <EditorToolbar
        editor={editor}
        onImageClick={onPickImage}
        imageUploading={imageUploading}
      />
      <EditorContent editor={editor} />
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={onFileChange}
      />
      {uploadError && (
        <p className="border-t border-border px-3 py-2 text-sm text-destructive">
          {uploadError}
        </p>
      )}
    </div>
  );
}
