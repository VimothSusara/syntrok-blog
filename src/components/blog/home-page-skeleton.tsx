import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type HomePostsSectionSkeletonProps = {
  title: string;
  description?: string;
};

export function HomePostsSectionSkeleton({
  title,
  description,
}: HomePostsSectionSkeletonProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          {description ? <Skeleton className="h-4 w-72" /> : null}
        </div>

        <Skeleton className="h-9 w-28" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={`${title}-${index}`} className="overflow-hidden">
            <CardHeader className="space-y-3 p-4">
              <Skeleton className="aspect-[16/10] w-full rounded-lg" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="flex items-center justify-between px-4 pb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="space-y-12">
      <section className="blog-hero-surface -mx-4 rounded-2xl border border-border/60 px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-6">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-12 w-full max-w-2xl rounded-2xl" />
          <Skeleton className="h-6 w-full max-w-xl rounded-2xl" />
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </section>

      <HomePostsSectionSkeleton
        title="Trending"
        description="Most liked articles from the community."
      />

      <HomePostsSectionSkeleton
        title="Latest"
        description="Fresh reads, newest first."
      />
    </div>
  );
}
