import Link from "next/link";
import { FollowAuthorButton } from "@/components/blog/follow-author-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDisplayName, getInitials } from "@/lib/users/display";

type AuthorProfileHeaderProps = {
  author: {
    id: string;
    username: string;
    name: string | null;
    email: string;
    imageUrl: string | null;
    bio: string | null;
    _count: {
      posts: number;
      followers: number;
      following: number;
    };
  };
  viewerId?: string | null;
  initialFollowing: boolean;
  isSignedIn: boolean;
};

export function AuthorProfileHeader({
  author,
  viewerId,
  initialFollowing,
  isSignedIn,
}: AuthorProfileHeaderProps) {
  const displayName = getDisplayName(author);
  const showFollow = viewerId !== author.id;

  return (
    <section className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <Avatar size="lg">
          {author.imageUrl ? (
            <AvatarImage src={author.imageUrl} alt={displayName} />
          ) : null}
          <AvatarFallback>
            {getInitials(author.name, author.email)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {displayName}
            </h1>
            <p className="text-sm text-muted-foreground">@{author.username}</p>
          </div>

          {author.bio && (
            <p className="max-w-2xl text-muted-foreground">{author.bio}</p>
          )}

          <p className="text-sm text-muted-foreground">
            {author._count.followers}{" "}
            {author._count.followers === 1 ? "follower" : "followers"} ·{" "}
            {author._count.following} following · {author._count.posts}{" "}
            {author._count.posts === 1 ? "post" : "posts"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showFollow && (
          <FollowAuthorButton
            targetUserId={author.id}
            username={author.username}
            initialFollowing={initialFollowing}
            isSignedIn={isSignedIn}
          />
        )}

        {viewerId === author.id && (
          <Link
            href="/dashboard/settings"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Edit profile
          </Link>
        )}
      </div>
    </section>
  );
}
