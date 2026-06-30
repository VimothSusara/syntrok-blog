import type { Metadata } from "next";
import { StatusPage } from "@/components/layout/status-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Coming soon",
  description: `This feature is coming soon on ${siteConfig.name}.`,
};

export default function ComingSoonPage() {
  return (
    <StatusPage
      code="Coming soon"
      title="We’re building this"
      description="This feature isn’t available yet. Check back soon or explore published posts in the meantime."
      primaryAction={{ label: "Browse posts", href: "/posts" }}
      secondaryAction={{ label: "Go home", href: "/" }}
    />
  );
}
