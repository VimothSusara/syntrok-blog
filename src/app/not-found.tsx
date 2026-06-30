import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { StatusPage } from "@/components/layout/status-page";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <StatusPage
        code="404"
        title="Page not found"
        description="The page you’re looking for doesn’t exist or may have been moved."
        primaryAction={{ label: "Browse posts", href: "/posts" }}
        secondaryAction={{ label: "Go home", href: "/" }}
      />
      <SiteFooter />
    </>
  );
}
