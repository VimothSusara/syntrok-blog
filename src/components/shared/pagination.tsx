import Link from "next/link";
import { buildQueryString } from "@/lib/urls/search-params";
import type { PaginationMeta } from "@/lib/pagination";
import { Button } from "@/components/ui/button";

type PaginationProps = {
  basePath: string;
  pagination: PaginationMeta;
  params: Record<string, string | string[] | undefined | null>;
};

export function Pagination({ basePath, pagination, params }: PaginationProps) {
  if (pagination.totalPages <= 1) return null;

  const linkParams = (page: number) => {
    const next = { ...params };
    if (page <= 1) delete next.page;
    else next.page = String(page);
    return `${basePath}${buildQueryString(next)}`;
  };

  return (
    <nav
      className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Pagination"
    >
      <p className="text-sm text-muted-foreground">
        Page {pagination.page} of {pagination.totalPages} · {pagination.total}{" "}
        {pagination.total === 1 ? "result" : "results"}
      </p>
      <div className="flex gap-2">
        {pagination.hasPrev ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={linkParams(pagination.page - 1)}>Previous</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
        )}
        {pagination.hasNext ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={linkParams(pagination.page + 1)}>Next</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        )}
      </div>
    </nav>
  );
}
