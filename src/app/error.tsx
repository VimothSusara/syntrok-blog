"use client";

import { useEffect } from "react";
import { StatusPage } from "@/components/layout/status-page";
import { Button } from "@/components/ui/button";

export default function Error({
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
    <div className="min-h-screen bg-background">
      <StatusPage
        code="Error"
        title="Something went wrong"
        description="An unexpected error occurred. You can try again or return to the homepage."
        primaryAction={{ label: "Go home", href: "/" }}
        secondaryAction={{ label: "Browse posts", href: "/posts" }}
      />
      <div className="-mt-8 flex justify-center pb-16">
        <Button type="button" variant="secondary" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
