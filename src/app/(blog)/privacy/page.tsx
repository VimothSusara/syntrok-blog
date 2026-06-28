import type { Metadata } from "next";
import { LegalPageShell } from "@/components/layout/legal-page-shell";
import { privacySections } from "@/config/legal";
import { siteConfig } from "@/config/site";
import { publicBreadcrumbs } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.name}.`,
  alternates: { canonical: `${siteConfig.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      breadcrumbs={publicBreadcrumbs.legal("Privacy Policy")}
      title="Privacy Policy"
      description={`How ${siteConfig.name} handles your data.`}
      sections={privacySections}
    />
  );
}
