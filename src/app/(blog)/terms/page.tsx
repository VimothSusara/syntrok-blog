import type { Metadata } from "next";
import { LegalPageShell } from "@/components/layout/legal-page-shell";
import { termsSections } from "@/config/legal";
import { siteConfig } from "@/config/site";
import { publicBreadcrumbs } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${siteConfig.name}.`,
  alternates: { canonical: `${siteConfig.url}/terms` },
};

export default function TermsPage() {
  return (
    <LegalPageShell
      breadcrumbs={publicBreadcrumbs.legal("Terms of Service")}
      title="Terms of Service"
      description={`Rules for using ${siteConfig.name}.`}
      sections={termsSections}
    />
  );
}
