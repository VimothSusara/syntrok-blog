import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { postsFilterUrl } from "@/lib/urls/public-posts";

type PostTaxonomyProps = {
  category?: { name: string; slug: string } | null;
  tags?: { tag: { name: string; slug: string } }[];
};

export function PostTaxonomy({ category, tags }: PostTaxonomyProps) {
  const tagItems = (tags ?? []).map((row) => row.tag);

  if (!category && tagItems.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {category && (
        <Badge variant="secondary" asChild>
          <Link href={postsFilterUrl({ category: category.slug })}>
            {category.name}
          </Link>
        </Badge>
      )}

      {tagItems.map((tag) => (
        <Badge key={tag.slug} variant="outline" asChild>
          <Link href={postsFilterUrl({ tag: tag.slug })}>{tag.name}</Link>
        </Badge>
      ))}
    </div>
  );
}
