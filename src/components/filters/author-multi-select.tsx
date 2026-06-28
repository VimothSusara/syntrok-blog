"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials, getUserLabel } from "@/lib/user-display";
import {
  SearchMultiSelect,
  type SearchMultiSelectItem,
} from "@/components/filters/search-multi-select";

export type AuthorOption = {
  id: string;
  username: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
  bio: string | null;
  publishedCount: number;
};

type AuthorMultiSelectProps = {
  authors: AuthorOption[];
  value: string[];
  onChange: (value: string[]) => void;
};

export function AuthorMultiSelect({
  authors,
  value,
  onChange,
}: AuthorMultiSelectProps) {
  const items: SearchMultiSelectItem[] = authors.map((author) => ({
    value: author.username,
    label: getUserLabel(author.name, author.email),
    keywords: `${author.username} ${author.email} ${author.bio ?? ""}`,
  }));

  return (
    <SearchMultiSelect
      items={items}
      value={value}
      onChange={onChange}
      placeholder="Select authors"
      searchPlaceholder="Search authors…"
      renderItem={(item) => {
        const author = authors.find((a) => a.username === item.value)!;
        return (
          <div className="flex min-w-0 items-center gap-2">
            <Avatar size="sm">
              {author.imageUrl ? (
                <AvatarImage src={author.imageUrl} alt={item.label} />
              ) : null}
              <AvatarFallback>
                {getUserInitials(author.name, author.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate font-medium">{item.label}</div>
              <div className="truncate text-xs text-muted-foreground">
                @{author.username} · {author.publishedCount} published
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
