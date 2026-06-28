import Link from "next/link";
import { Fragment } from "react";
import type { BreadcrumbItem } from "@/lib/breadcrumbs";
import {
  Breadcrumb,
  BreadcrumbItem as BreadcrumbItemRoot,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

type PageBreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function PageBreadcrumb({ items, className }: PageBreadcrumbProps) {
  if (!items.length) return null;

  return (
    <Breadcrumb className={cn(className)}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = isLast || !item.href;

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItemRoot>
                {isCurrent ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href!}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItemRoot>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
