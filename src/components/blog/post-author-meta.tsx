import Link from "next/link";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authorProfileUrl } from "@/lib/urls/authors";
import { getDisplayName, getInitials } from "@/lib/users/display";

type PostAuthorMetaProps = {
  author: {
    id: string;
    username: string | null;
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
  publishedAt: Date | null;
  actions?: React.ReactNode;
};

export function PostAuthorMeta({
  author,
  publishedAt,
  actions,
}: PostAuthorMetaProps) {
  const displayName = getDisplayName(author);
  const profileHref = authorProfileUrl(author);

  const authorIdentity = (
    <>
      <Avatar size="default">
        {author.imageUrl ? (
          <AvatarImage src={author.imageUrl} alt={displayName} />
        ) : null}
        <AvatarFallback>
          {getInitials(author.name, author.email)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <p
          className={
            profileHref
              ? "truncate font-medium text-foreground transition-colors group-hover:text-primary"
              : "truncate font-medium text-foreground"
          }
        >
          {displayName}
        </p>
        <p className="text-xs text-muted-foreground">
          {author.username ? `@${author.username}` : "Author"}
        </p>
      </div>
    </>
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
        {profileHref ? (
          <Link
            href={profileHref}
            className="group flex min-w-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {authorIdentity}
          </Link>
        ) : (
          <div className="flex min-w-0 items-center gap-3">
            {authorIdentity}
          </div>
        )}

        {actions}
      </div>

      {publishedAt && (
        <time
          dateTime={publishedAt.toISOString()}
          className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Calendar className="size-4" aria-hidden="true" />
          {format(publishedAt, "MMMM d, yyyy")}
        </time>
      )}
    </div>
  );
}
