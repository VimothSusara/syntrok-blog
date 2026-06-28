import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getAuthorStats } from "@/lib/analytics/author-stats";
import { AuthorStatsCards } from "@/components/dashboard/author-stats-cards";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { dashboardBreadcrumbs } from "@/lib/breadcrumbs";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const stats = user ? await getAuthorStats(user.id) : null;

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={dashboardBreadcrumbs.overview()}
        title="Dashboard"
        description={`Welcome, ${user?.name ?? user?.email}`}
        actions={
          <Button asChild>
            <Link href="/dashboard/posts/new">New post</Link>
          </Button>
        }
      />

      {stats && <AuthorStatsCards stats={stats} />}
    </div>
  );
}
