import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/layout/legal-page-shell";
import { helpSections } from "@/config/legal";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Help",
  description: `Help and FAQs for ${siteConfig.name}.`,
  alternates: { canonical: `${siteConfig.url}/help` },
};

export default function HelpPage() {
  return (
    <LegalPageShell
      title="Help"
      description={`Quick answers for using ${siteConfig.name}.`}
      sections={helpSections}
    >
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href="/posts">Browse posts</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">Open dashboard</Link>
        </Button>
        <Button asChild size="sm">
          <Link href={siteConfig.links.contact}>Contact support</Link>
        </Button>
      </div>
    </LegalPageShell>
  );
}
