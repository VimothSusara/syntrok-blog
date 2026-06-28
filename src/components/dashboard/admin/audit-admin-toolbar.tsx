"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  auditAdminFiltersToParams,
  AUDIT_ADMIN_ACTIONS,
  AUDIT_ADMIN_ENTITIES,
  type AuditAdminFilters,
} from "@/lib/search-params/audit-admin";
import { auditActionLabels, auditEntityLabels } from "@/lib/audit/labels";
import { buildQueryString } from "@/lib/urls/search-params";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type AuditAdminToolbarProps = {
  basePath: string;
  filters: AuditAdminFilters;
};

export function AuditAdminToolbar({
  basePath,
  filters,
}: AuditAdminToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigate = (next: Partial<AuditAdminFilters>) => {
    const merged = { ...filters, ...next, page: 1 };
    startTransition(() => {
      router.push(
        `${basePath}${buildQueryString(auditAdminFiltersToParams(merged))}`,
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
          placeholder="Search entity ID, actor, target…"
          className="flex-1"
        />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <select
        className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
        value={filters.action}
        onChange={(e) =>
          navigate({ action: e.target.value as AuditAdminFilters["action"] })
        }
      >
        {AUDIT_ADMIN_ACTIONS.map((action) => (
          <option key={action} value={action}>
            {action === "all"
              ? "All actions"
              : auditActionLabels[action as keyof typeof auditActionLabels]}
          </option>
        ))}
      </select>

      <select
        className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
        value={filters.entity}
        onChange={(e) =>
          navigate({ entity: e.target.value as AuditAdminFilters["entity"] })
        }
      >
        {AUDIT_ADMIN_ENTITIES.map((entity) => (
          <option key={entity} value={entity}>
            {entity === "all"
              ? "All entities"
              : auditEntityLabels[entity as keyof typeof auditEntityLabels]}
          </option>
        ))}
      </select>

      {isPending && <Spinner className="size-4" />}
    </div>
  );
}
