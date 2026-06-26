import { publicIdFromCloudinaryUrl } from "@/lib/media/cloudinary-public-id";

type TiptapNode = {
  type?: string;
  text?: string;
  attrs?: { alt?: string; src?: string; publicId?: string | null };
  content?: TiptapNode[];
};

type TiptapDoc = {
  type: string;
  content?: TiptapNode[];
};

export const EMPTY_TIPTAP_DOC = JSON.stringify({
  type: "doc",
  content: [{ type: "paragraph" }],
});

export function isTiptapDoc(value: string): boolean {
  try {
    const doc = JSON.parse(value) as TiptapDoc;
    return doc.type === "doc" && Array.isArray(doc.content);
  } catch {
    return false;
  }
}

function walkNodes(nodes: TiptapNode[] | undefined, parts: string[]) {
  for (const node of nodes ?? []) {
    if (node.type === "text" && node.text) parts.push(node.text);
    if (node.type === "image" && node.attrs?.alt) parts.push(node.attrs.alt);
    if (node.content?.length) walkNodes(node.content, parts);
    if (
      node.type === "paragraph" ||
      node.type === "heading" ||
      node.type === "listItem" ||
      node.type === "blockquote"
    ) {
      parts.push("\n");
    }
  }
}

export function tiptapJsonToPlainText(content: string): string {
  try {
    const doc = JSON.parse(content) as TiptapDoc;
    if (!doc.content?.length) return "";
    const parts: string[] = [];
    walkNodes(doc.content, parts);
    return parts
      .join("")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  } catch {
    return content;
  }
}

export function isTiptapDocEmpty(content: string): boolean {
  if (tiptapJsonToPlainText(content).length > 0) return false;
  try {
    return !JSON.stringify(JSON.parse(content)).includes('"type":"image"');
  } catch {
    return true;
  }
}

/** Legacy plain-text posts */
export function plainTextToTiptapJson(text: string): string {
  const paragraphs = text.split("\n").map((line) => ({
    type: "paragraph",
    content: line ? [{ type: "text", text: line }] : [],
  }));
  return JSON.stringify({ type: "doc", content: paragraphs });
}

export function parsePostContentForForm(storedContent: string): string {
  if (isTiptapDoc(storedContent)) return storedContent;
  return plainTextToTiptapJson(storedContent);
}

/** Preferred: public_id stored on image nodes at upload time. */
export function extractImagePublicIdsFromTiptapContent(content: string): string[] {
  const ids: string[] = [];

  function walk(nodes: TiptapNode[] | undefined) {
    for (const node of nodes ?? []) {
      if (node.type === "image") {
        const storedId = node.attrs?.publicId?.trim();
        if (storedId) {
          ids.push(storedId);
        } else if (node.attrs?.src) {
          const fromUrl = publicIdFromCloudinaryUrl(node.attrs.src);
          if (fromUrl) ids.push(fromUrl);
        }
      }
      if (node.content?.length) walk(node.content);
    }
  }

  try {
    const doc = JSON.parse(content) as TiptapDoc;
    walk(doc.content);
  } catch {
    // ignore invalid JSON
  }

  return ids;
}
