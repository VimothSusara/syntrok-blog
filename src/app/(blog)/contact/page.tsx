import type { Metadata } from "next";
import { ContactForm } from "@/components/blog/contace-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${siteConfig.name}.`,
  alternates: { canonical: `${siteConfig.url}/contact` },
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
        <p className="text-sm text-muted-foreground">
          Questions, feedback, or account issues — reach us at{" "}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-primary hover:underline"
          >
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </header>

      <ContactForm />
    </article>
  );
}
