import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type SiteLogoProps = {
  href?: string;
  showName?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: {
    mark: "size-7",
    text: "text-sm",
  },
  md: {
    mark: "size-8",
    text: "text-base",
  },
  lg: {
    mark: "size-10",
    text: "text-lg",
  },
} as const;

export function SiteLogo({
  href = "/",
  showName = false,
  className,
  size = "md",
}: SiteLogoProps) {
  const Wrapper = href ? Link : "div";

  return (
    <Wrapper
      href={href}
      className={cn("inline-flex items-center gap-2", className)}
      aria-label={siteConfig.branding.alt}
    >
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-md",
          sizeClasses[size].mark,
        )}
      >
        <Image
          src={siteConfig.branding.logoLight}
          alt={siteConfig.branding.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain dark:hidden"
        />
        <Image
          src={siteConfig.branding.logoDark}
          alt={siteConfig.branding.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="hidden object-contain dark:block"
        />
      </span>

      {showName ? (
        <span
          className={cn(
            "font-heading font-semibold tracking-tight",
            sizeClasses[size].text,
          )}
        >
          {siteConfig.name}
        </span>
      ) : null}
    </Wrapper>
  );
}
