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
import { PostAiPanel } from "@/components/dashboard/post-ai-panel";
import { QuickCreateTaxonomyDialog } from "@/components/dashboard/quick-create-taxonomy-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import { EMPTY_TIPTAP_DOC, parsePostContentForForm } from "@/lib/posts/content";
import type { Post } from "../../../generated/prisma/client";

type PostFormProps = {
  mode: "create" | "edit";
  userId: string;
  canManageTaxonomy?: boolean;
  post?: Post & { tags?: { tagId: string }[] };
  categories: { id: string; name: string; slug?: string }[];
  tags: { id: string; name: string; slug: string }[];
};

const initialState: PostActionState = {};

function FieldLabel({
  htmlFor,
  children,
  action,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {children}
      </label>
      {action}
    </div>
  );
}

export function PostForm({
  mode,
  post,
  userId,
  canManageTaxonomy = false,
  categories: initialCategories,
  tags: initialTags,
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
  const [summary, setSummary] = useState(post?.summary ?? "");
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    post?.metaDescription ?? "",
  );

  const [categories, setCategories] = useState(initialCategories);
  const [availableTags, setAvailableTags] = useState(initialTags);

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
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Short description for listings and SEO"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="metaTitle" className="text-sm font-medium">
            SEO title
          </label>
          <Input
            id="metaTitle"
            name="metaTitle"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="Optional SEO title"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="metaDescription" className="text-sm font-medium">
            Meta description
          </label>
          <Textarea
            id="metaDescription"
            name="metaDescription"
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Optional meta description"
          />
        </div>
      </div>

      <div className="space-y-2">
        <FieldLabel
          action={
            canManageTaxonomy ? (
              <QuickCreateTaxonomyDialog
                kind="category"
                onCreated={(category) => {
                  setCategories((prev) => {
                    if (prev.some((c) => c.id === category.id)) return prev;
                    return [...prev, category].sort((a, b) =>
                      a.name.localeCompare(b.name),
                    );
                  });
                  setCategoryId(category.id);
                }}
              />
            ) : null
          }
        >
          Category
        </FieldLabel>
        <CategoryCombobox
          categories={categories}
          value={categoryId}
          onChange={setCategoryId}
        />
      </div>

      <div className="space-y-2">
        <FieldLabel
          action={
            canManageTaxonomy ? (
              <QuickCreateTaxonomyDialog
                kind="tag"
                onCreated={(tag) => {
                  setAvailableTags((prev) => {
                    if (prev.some((t) => t.id === tag.id)) return prev;
                    return [...prev, tag].sort((a, b) =>
                      a.name.localeCompare(b.name),
                    );
                  });
                  setTagIds((prev) =>
                    prev.includes(tag.id) ? prev : [...prev, tag.id],
                  );
                }}
              />
            ) : null
          }
        >
          Tags
        </FieldLabel>
        <TagMultiSelect
          tags={availableTags}
          value={tagIds}
          onChange={setTagIds}
        />
      </div>

      <CoverImageField
        userId={userId}
        defaultUrl={post?.coverImageUrl}
        defaultPublicId={post?.coverImagePublicId}
      />

      <PostAiPanel
        postId={post?.id}
        title={title}
        content={content}
        selectedTagIds={tagIds}
        onApplySummary={setSummary}
        onApplySeoMeta={(meta) => {
          setMetaTitle(meta.title);
          setMetaDescription(meta.description);
        }}
        onApplyContent={setContent}
        onApplyTags={({ tagIds: nextTagIds, tags }) => {
          setAvailableTags(tags);
          setTagIds(nextTagIds);
        }}
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
