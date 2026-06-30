import Link from "next/link";
import { StatusPage } from "@/components/layout/status-page";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="space-y-4">
      <StatusPage
        code="404"
        title="Dashboard page not found"
        description="That dashboard route doesn’t exist."
        primaryAction={{ label: "Back to dashboard", href: "/dashboard" }}
        secondaryAction={{ label: "My posts", href: "/dashboard/posts" }}
        className="min-h-[50vh]"
      />
      <div className="flex justify-center">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">Back to site</Link>
        </Button>
      </div>
    </div>
  );
}
