import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SiteLogo } from "../shared/site-logo";

type AuthShellProps = {
  title: string;
  description: string;
  alternateLabel: string;
  alternateHref: string;
  children: React.ReactNode;
};

export function AuthShell({
  title,
  description,
  alternateLabel,
  alternateHref,
  children,
}: AuthShellProps) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <aside className="relative hidden h-full w-full flex-col justify-between border-r border-border bg-muted/40 p-10 lg:flex">
        <div>
          <SiteLogo size="lg" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {siteConfig.auth.panel.headline}
          </h1>
          <p className="max-w-md text-muted-foreground">
            {siteConfig.auth.panel.description}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </aside>
      {/* Form panel */}
      <main className="flex h-full w-full flex-col items-center justify-center p-6 sm:p-10">
        <div className="mb-8 w-full max-w-md lg:hidden">
          <SiteLogo />
        </div>
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
          {/* <p className="text-center text-sm text-muted-foreground">
            {alternateLabel}{" "}
            <Link
              href={alternateHref}
              className="font-medium text-primary hover:opacity-80"
            >
              {alternateHref.includes("sign-up") ? "Sign up" : "Sign in"}
            </Link>
          </p> */}
        </div>
      </main>
    </div>
  );
}
