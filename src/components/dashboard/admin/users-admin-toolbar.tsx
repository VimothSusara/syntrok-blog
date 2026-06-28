"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  userAdminFiltersToParams,
  USER_ADMIN_ROLES,
  USER_ADMIN_STATUSES,
  type UserAdminFilters,
} from "@/lib/search-params/user-admin";
import { buildQueryString } from "@/lib/urls/search-params";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type UsersAdminToolbarProps = {
  basePath: string;
  filters: UserAdminFilters;
};

export function UsersAdminToolbar({
  basePath,
  filters,
}: UsersAdminToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigate = (next: Partial<UserAdminFilters>) => {
    const merged = { ...filters, ...next, page: 1 };
    startTransition(() => {
      router.push(
        `${basePath}${buildQueryString(userAdminFiltersToParams(merged))}`,
      );
    });
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <form
        className="flex flex-1 gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          navigate({ q: String(fd.get("q") ?? "").trim() || undefined });
        }}
      >
        <Input
          name="q"
          key={searchParams.get("q") ?? ""}
          defaultValue={filters.q ?? ""}
          placeholder="Search name, email, username…"
          className="flex-1"
        />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <select
        className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
        value={filters.status}
        onChange={(e) =>
          navigate({
            status: e.target.value as UserAdminFilters["status"],
          })
        }
      >
        {USER_ADMIN_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status === "all" ? "All statuses" : status.toLowerCase()}
          </option>
        ))}
      </select>

      <select
        className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
        value={filters.role}
        onChange={(e) =>
          navigate({
            role: e.target.value as UserAdminFilters["role"],
          })
        }
      >
        {USER_ADMIN_ROLES.map((role) => (
          <option key={role} value={role}>
            {role === "all" ? "All roles" : role.toLowerCase()}
          </option>
        ))}
      </select>

      {isPending && <Spinner className="size-4" />}
    </div>
  );
}
