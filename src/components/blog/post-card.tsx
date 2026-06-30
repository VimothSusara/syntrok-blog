import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart } from "lucide-react";

type PostCardProps = {
  post: {
    slug: string;
    title: string;
    summary: string | null;
    coverImageUrl: string | null;
    publishedAt: Date | null;
    likeCount?: number;
    category?: { name: string; slug: string } | null;
    author: {
      name: string | null;
      email: string;
    };
  };
};

export function PostCard({ post }: PostCardProps) {
  const authorLabel = post.author.name ?? post.author.email;
  const dateLabel = post.publishedAt
    ? post.publishedAt.toLocaleDateString()
    : null;
  const likeCount = post.likeCount ?? 0;
  return (
    <Card
      size="sm"
      className="group h-full overflow-hidden ring-1 ring-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-border"
    >
      <Link href={`/posts/${post.slug}`} className="flex h-full flex-col">
        {post.coverImageUrl ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={post.coverImageUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <div className="aspect-[16/10] w-full bg-muted" />
        )}
        <CardHeader className="flex-1 gap-1">
          {post.category && (
            <p className="text-xs font-medium text-primary">
              {post.category.name}
            </p>
          )}
          <CardTitle className="line-clamp-2 text-base leading-snug group-hover:text-primary">
            {post.title}
          </CardTitle>
          <CardDescription className="line-clamp-1 text-xs">
            {authorLabel}
            {dateLabel ? ` · ${dateLabel}` : ""}
          </CardDescription>
          {post.summary && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {post.summary}
            </p>
          )}
          <p className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
            <Heart className="size-3.5" aria-hidden />
            <span>
              {likeCount} {likeCount === 1 ? "like" : "likes"}
            </span>
          </p>
        </CardHeader>
      </Link>
    </Card>
  );
}
