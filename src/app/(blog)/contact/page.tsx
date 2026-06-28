import type { Metadata } from "next";
import { ContactForm } from "@/components/blog/contace-form";
import { siteConfig } from "@/config/site";
import { publicBreadcrumbs } from "@/lib/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${siteConfig.name}.`,
  alternates: { canonical: `${siteConfig.url}/contact` },
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        variant="public"
        breadcrumbs={publicBreadcrumbs.legal("Contact")}
        title="Contact"
        description="Questions, feedback, or account issues — reach us at {siteConfig.contactEmail}."
        className="pb-6"
      />

      <ContactForm />
    </article>
  );
}
