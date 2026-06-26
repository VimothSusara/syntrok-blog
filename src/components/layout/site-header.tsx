import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { siteConfig } from "@/config/site";
import { SiteNavLinks } from "@/components/layout/site-nav-links";
import { SiteMobileNav } from "@/components/layout/site-mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight text-foreground"
        >
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-1">
          <nav className="hidden items-center gap-4 md:flex">
            <SiteNavLinks />
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <UserButton />
            </Show>
            <Show when="signed-out">
              <Button variant="outline" size="sm" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </Show>
          </nav>

          <ThemeToggle />

          <div className="md:hidden">
            <SiteMobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
