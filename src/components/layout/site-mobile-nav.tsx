"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Show, UserButton } from "@clerk/nextjs";
import { siteConfig } from "@/config/site";
import { SiteNavLinks } from "@/components/layout/site-nav-links";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function SiteMobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>{siteConfig.name}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          <SiteNavLinks
            orientation="vertical"
            onNavigate={() => {
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "Escape" }),
              );
            }}
          />

          <Separator />

          <Show when="signed-in">
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-foreground"
              >
                Dashboard
              </Link>
              <UserButton />
            </div>
          </Show>

          <Show when="signed-out">
            <Button variant="outline" size="sm" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </Show>
        </div>
      </SheetContent>
    </Sheet>
  );
}
