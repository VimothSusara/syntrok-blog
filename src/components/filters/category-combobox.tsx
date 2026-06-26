"use client";

import {
  SearchMultiSelect,
  type SearchMultiSelectItem,
} from "@/components/filters/search-multi-select";

type CategoryComboboxProps = {
  categories: { id: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
};

export function CategoryCombobox({
  categories,
  value,
  onChange,
}: CategoryComboboxProps) {
  const items: SearchMultiSelectItem[] = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <>
      <SearchMultiSelect
        items={items}
        value={value ? [value] : []}
        onChange={(next) => onChange(next[0] ?? "")}
        multiple={false}
        placeholder="Select category"
        searchPlaceholder="Search categories…"
      />
      <input type="hidden" name="categoryId" value={value} />
    </>
  );
}
