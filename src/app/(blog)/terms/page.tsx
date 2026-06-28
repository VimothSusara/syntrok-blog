import type { Metadata } from "next";
import { LegalPageShell } from "@/components/layout/legal-page-shell";
import { termsSections } from "@/config/legal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${siteConfig.name}.`,
  alternates: { canonical: `${siteConfig.url}/terms` },
};

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms of Service"
      description={`Rules for using ${siteConfig.name}.`}
      sections={termsSections}
    />
  );
}
