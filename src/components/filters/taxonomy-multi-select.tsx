"use client";

import {
  SearchMultiSelect,
  type SearchMultiSelectItem,
} from "@/components/filters/search-multi-select";

export type TaxonomyOption = {
  slug: string;
  name: string;
  description?: string | null;
  count?: number;
};

type TaxonomyMultiSelectProps = {
  items: TaxonomyOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  searchPlaceholder: string;
};

export function TaxonomyMultiSelect({
  items,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
}: TaxonomyMultiSelectProps) {
  const selectItems: SearchMultiSelectItem[] = items.map((item) => ({
    value: item.slug,
    label: item.name,
    keywords: item.description ?? "",
  }));

  return (
    <SearchMultiSelect
      items={selectItems}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      renderItem={(item) => {
        const row = items.find((i) => i.slug === item.value)!;
        return (
          <div className="min-w-0">
            <div className="font-medium">{row.name}</div>
            {row.count != null && (
              <div className="text-xs text-muted-foreground">
                {row.count} posts
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
