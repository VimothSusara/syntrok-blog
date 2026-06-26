import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AuthorStatsCardsProps = {
  stats: {
    total: number;
    published: number;
    drafts: number;
    views: number;
  };
};

export function AuthorStatsCards({ stats }: AuthorStatsCardsProps) {
  const items = [
    { label: "Total posts", value: stats.total },
    { label: "Published", value: stats.published },
    { label: "Drafts", value: stats.drafts },
    { label: "Total views", value: stats.views },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
