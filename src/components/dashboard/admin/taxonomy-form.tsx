"use client";

import { useActionState, useEffect, useState } from "react";
import type { TaxonomyActionState } from "@/app/dashboard/admin/categories/actions";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

type TaxonomyFormProps = {
  mode: "create" | "edit";
  action: (
    prev: TaxonomyActionState,
    formData: FormData,
  ) => Promise<TaxonomyActionState>;
  defaultValues?: {
    name: string;
    slug: string;
    description: string | null;
    isActive: boolean;
  };
  onSuccess?: () => void;
  submitLabel?: string;
};

const initialState: TaxonomyActionState = {};

export function TaxonomyForm({
  mode,
  action,
  defaultValues,
  onSuccess,
  submitLabel,
}: TaxonomyFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [isActive, setIsActive] = useState(defaultValues?.isActive ?? true);

  useEffect(() => {
    if (state.success) onSuccess?.();
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-primary">{state.success}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (mode === "create" && !slugTouched) {
                setSlug(slugify(e.target.value));
              }
            }}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Slug</label>
          <Input
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ""}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={isActive}
          onCheckedChange={(checked) => setIsActive(checked === true)}
        />
        Active
      </label>
      <input type="hidden" name="isActive" value={isActive ? "on" : "off"} />

      <Button type="submit" disabled={pending}>
        {pending
          ? "Saving…"
          : (submitLabel ?? (mode === "create" ? "Create" : "Save changes"))}
      </Button>
    </form>
  );
}
