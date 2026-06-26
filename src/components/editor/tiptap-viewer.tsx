"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { parsePostContentForForm } from "@/lib/posts/content";
import { TiptapImage } from "./tiptap-image";

type TiptapViewerProps = {
  content: string;
};

export function TiptapViewer({ content }: TiptapViewerProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: true,
          HTMLAttributes: {
            class: "text-primary underline underline-offset-4",
          },
        },
      }),
      TiptapImage.configure({
        HTMLAttributes: { class: "my-6" },
      }),
    ],
    content: JSON.parse(parsePostContentForForm(content)),
    editorProps: {
      attributes: {
        class: "tiptap prose-blog max-w-none",
      },
    },
  });

  return <EditorContent editor={editor} />;
}
