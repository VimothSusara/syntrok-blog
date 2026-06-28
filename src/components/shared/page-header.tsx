import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/lib/breadcrumbs";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  breadcrumbs?: BreadcrumbItem[];
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  variant?: "public" | "dashboard";
  className?: string;
};

export function PageHeader({
  breadcrumbs,
  title,
  description,
  meta,
  actions,
  variant = "dashboard",
  className,
}: PageHeaderProps) {
  const titleClassName =
    variant === "public"
      ? "text-3xl font-semibold tracking-tight sm:text-4xl"
      : "text-2xl font-semibold";

  return (
    <header className={cn("space-y-3 border-b border-border pb-6", className)}>
      {breadcrumbs?.length ? <PageBreadcrumb items={breadcrumbs} /> : null}

      <div
        className={cn(
          actions && "flex flex-wrap items-start justify-between gap-4",
        )}
      >
        <div className="space-y-2">
          <h1 className={titleClassName}>{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
          {meta ? (
            <p className="text-sm text-muted-foreground">{meta}</p>
          ) : null}
        </div>
        {actions}
      </div>
    </header>
  );
}
