"use client";

import { TaxonomyMultiSelect } from "@/components/filters/taxonomy-multi-select";

type TagMultiSelectProps = {
  tags: { id: string; name: string; slug: string }[];
  value: string[];
  onChange: (value: string[]) => void;
};

export function TagMultiSelect({ tags, value, onChange }: TagMultiSelectProps) {
  return (
    <>
      <TaxonomyMultiSelect
        items={tags.map((t) => ({ slug: t.id, name: t.name }))}
        value={value}
        onChange={onChange}
        placeholder="Select tags"
        searchPlaceholder="Search tags…"
      />
      {value.map((id) => (
        <input key={id} type="hidden" name="tagIds" value={id} />
      ))}
    </>
  );
}
