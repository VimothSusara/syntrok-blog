import Link from "next/link";
import { siteConfig } from "@/config/site";
import { legalLastUpdated } from "@/config/legal";

type LegalSection = {
  title: string;
  body: string;
};

type LegalPageShellProps = {
  title: string;
  description: string;
  sections: readonly LegalSection[];
  children?: React.ReactNode;
};

export function LegalPageShell({
  title,
  description,
  sections,
  children,
}: LegalPageShellProps) {
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">
          Last updated {legalLastUpdated}
        </p>
      </header>

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
