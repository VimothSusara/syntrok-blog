import Link from "next/link";
import { siteConfig } from "@/config/site";
import { legalLastUpdated } from "@/config/legal";
import type { BreadcrumbItem } from "@/lib/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";

type LegalSection = {
  title: string;
  body: string;
};

type LegalPageShellProps = {
  title: string;
  description: string;
  sections: readonly LegalSection[];
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
};

export function LegalPageShell({
  title,
  description,
  sections,
  breadcrumbs,
  children,
}: LegalPageShellProps) {
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        variant="public"
        breadcrumbs={breadcrumbs}
        title={title}
        description={description}
        meta={`Last updated ${legalLastUpdated}`}
        className="pb-6"
      />

      {children}

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              {section.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {section.body}
            </p>
          </section>
        ))}
      </div>

      <footer className="border-t border-border pt-6 text-sm text-muted-foreground">
        <p>
          Related:{" "}
          <Link
            href={siteConfig.links.terms}
            className="text-primary hover:underline"
          >
            Terms
          </Link>
          {" · "}
          <Link
            href={siteConfig.links.privacy}
            className="text-primary hover:underline"
          >
            Privacy
          </Link>
          {" · "}
          <Link
            href={siteConfig.links.contact}
            className="text-primary hover:underline"
          >
            Contact
          </Link>
        </p>
      </footer>
    </article>
  );
}
