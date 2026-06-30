"use client";

import { useEffect } from "react";
import { StatusPage } from "@/components/layout/status-page";
import { Button } from "@/components/ui/button";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <StatusPage
          code="500"
          title="Application error"
          description="A critical error occurred. Please refresh the page or try again later."
          primaryAction={{ label: "Go home", href: "/" }}
        />
        <div className="-mt-8 flex justify-center pb-16">
          <Button type="button" variant="secondary" onClick={reset}>
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
