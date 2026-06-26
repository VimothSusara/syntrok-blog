"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  createPostAction,
  updatePostAction,
  type PostActionState,
} from "@/app/dashboard/posts/actions";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { CoverImageField } from "@/components/dashboard/cover-image-field";
import { CategoryCombobox } from "@/components/filters/category-combobox";
import { TagMultiSelect } from "@/components/filters/tag-multi-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import { EMPTY_TIPTAP_DOC, parsePostContentForForm } from "@/lib/posts/content";
import type { Post } from "../../../generated/prisma/client";

type PostFormProps = {
  mode: "create" | "edit";
  userId: string;
  post?: Post & { tags?: { tagId: string }[] };
  categories: { id: string; name: string }[];
  tags: { id: string; name: string; slug: string }[];
};

const initialState: PostActionState = {};

export function PostForm({
  mode,
  post,
  userId,
  categories,
  tags,
}: PostFormProps) {
  const action =
    mode === "create"
      ? createPostAction
      : updatePostAction.bind(null, post!.id);

  const [state, formAction, pending] = useActionState(action, initialState);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [content, setContent] = useState(
    post ? parsePostContentForForm(post.content) : EMPTY_TIPTAP_DOC,
  );
  const [categoryId, setCategoryId] = useState(post?.categoryId ?? "");
  const [tagIds, setTagIds] = useState<string[]>(
    post?.tags?.map((t) => t.tagId) ?? [],
  );

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (mode === "create" && !slugTouched) {
      setSlug(slugify(value));
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
        />
        {state.fieldErrors?.title && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.title[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="slug" className="text-sm font-medium">
          Slug
        </label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          required
        />
        {mode === "create" && !slugTouched && (
          <p className="text-xs text-muted-foreground">
            Slug updates automatically from the title until you edit it.
          </p>
        )}
        {state.fieldErrors?.slug && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.slug[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="summary" className="text-sm font-medium">
          Summary
        </label>
        <Textarea
          id="summary"
          name="summary"
          rows={3}
          defaultValue={post?.summary ?? ""}
          placeholder="Short description for listings and SEO"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <CategoryCombobox
          categories={categories}
          value={categoryId}
          onChange={setCategoryId}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <TagMultiSelect tags={tags} value={tagIds} onChange={setTagIds} />
      </div>

      <CoverImageField
        userId={userId}
        defaultUrl={post?.coverImageUrl}
        defaultPublicId={post?.coverImagePublicId}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Content</label>
        <input type="hidden" name="content" value={content} />
        <TiptapEditor value={content} onChange={setContent} />
        {state.fieldErrors?.content && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.content[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={post?.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT"}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending
            ? "Saving…"
            : mode === "create"
              ? "Create post"
              : "Save changes"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/posts">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
