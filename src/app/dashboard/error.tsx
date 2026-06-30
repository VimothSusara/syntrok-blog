"use client";

import { useEffect } from "react";
import { StatusPage } from "@/components/layout/status-page";
import { Button } from "@/components/ui/button";

export default function DashboardError({
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
    <div className="space-y-4">
      <StatusPage
        code="Error"
        title="Dashboard error"
        description="Something went wrong loading this dashboard page."
        primaryAction={{ label: "Dashboard home", href: "/dashboard" }}
        className="min-h-[50vh]"
      />
      <div className="flex justify-center">
        <Button type="button" variant="secondary" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
