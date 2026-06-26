import Image from "@tiptap/extension-image";

/** Image node with Cloudinary public_id for reliable asset lifecycle management. */
export const TiptapImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      publicId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-public-id"),
        renderHTML: (attributes) => {
          if (!attributes.publicId) return {};
          return { "data-public-id": attributes.publicId };
        },
      },
    };
  },
});
