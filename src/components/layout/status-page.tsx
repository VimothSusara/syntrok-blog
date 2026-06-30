import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StatusAction = {
  label: string;
  href: string;
};

type StatusPageProps = {
  code?: string;
  title: string;
  description: string;
  primaryAction?: StatusAction;
  secondaryAction?: StatusAction;
  className?: string;
};

export function StatusPage({
  code,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: StatusPageProps) {
  return (
    <main
      className={cn(
        "mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center px-4 py-16 text-center",
        className,
      )}
    >
      {code ? (
        <p className="text-sm font-medium tracking-wide text-primary uppercase">
          {code}
        </p>
      ) : null}

      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>

      {(primaryAction || secondaryAction) && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {primaryAction ? (
            <Button asChild>
              <Link href={primaryAction.href}>{primaryAction.label}</Link>
            </Button>
          ) : null}
          {secondaryAction ? (
            <Button asChild variant="outline">
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          ) : null}
        </div>
      )}
    </main>
  );
}
