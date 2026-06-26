import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getAuthorStats } from "@/lib/analytics/author-stats";
import { AuthorStatsCards } from "@/components/dashboard/author-stats-cards";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const stats = user ? await getAuthorStats(user.id) : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, {user?.name ?? user?.email}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/posts/new">New post</Link>
        </Button>
      </div>

      {stats && <AuthorStatsCards stats={stats} />}
    </div>
  );
}
