"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import type { PublicPostFilters } from "@/lib/search-params/public-posts";
import { Button } from "@/components/ui/button";

type PostFollowingToggleProps = {
  filters: PublicPostFilters;
  isSignedIn: boolean;
  disabled?: boolean;
  onChange: (next: PublicPostFilters) => void;
};

export function PostFollowingToggle({
  filters,
  isSignedIn,
  disabled,
  onChange,
}: PostFollowingToggleProps) {
  if (!isSignedIn) {
    return (
      <Button asChild variant="outline" size="sm" className="gap-2">
        <Link href="/sign-in">
          <Users className="size-4" aria-hidden />
          Following
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={filters.following ? "secondary" : "outline"}
      size="sm"
      disabled={disabled}
      aria-pressed={filters.following}
      className="gap-2"
      onClick={() =>
        onChange({
          ...filters,
          following: !filters.following,
          page: 1,
        })
      }
    >
      <Users className="size-4" aria-hidden />
      Following
    </Button>
  );
}
