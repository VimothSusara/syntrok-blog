import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthorProfileHeader } from "@/components/blog/author-profile-header";
import { PostCard } from "@/components/blog/post-card";
import { PostGrid, PostGridItem } from "@/components/blog/post-grid";
import { Pagination } from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  getPublicAuthorByUsername,
  getPublishedPostsByAuthorPaginated,
  parseAuthorPage,
} from "@/lib/db/authors";
import { isFollowing } from "@/lib/db/follows";
import { getDisplayName } from "@/lib/users/display";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { publicBreadcrumbs } from "@/lib/breadcrumbs";

type AuthorPageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { username } = await params;
  const author = await getPublicAuthorByUsername(username);

  if (!author) {
    return { title: "Author not found" };
  }

  const name = getDisplayName(author);

  return {
    title: `${name} (@${author.username})`,
    description:
      author.bio ?? `Read articles by ${name} on ${siteConfig.name}.`,
  };
}

export default async function AuthorPage({
  params,
  searchParams,
}: AuthorPageProps) {
  const { username } = await params;
  const raw = await searchParams;
  const page = parseAuthorPage(raw);

  const author = await getPublicAuthorByUsername(username);
  if (!author || !author.username) notFound();

  const viewer = await getCurrentUser();
  const following =
    viewer && viewer.id !== author.id
      ? await isFollowing(viewer.id, author.id)
      : false;

  const { items, pagination } = await getPublishedPostsByAuthorPaginated(
    author.id,
    page,
  );

  const displayName = getDisplayName(author);

  return (
    <div className="space-y-8">
      <PageBreadcrumb items={publicBreadcrumbs.author(displayName)} />

      <AuthorProfileHeader
        author={{ ...author, username: author.username }}
        viewerId={viewer?.id}
        initialFollowing={following}
        isSignedIn={!!viewer}
      />

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Published posts</h2>

        {items.length ? (
          <>
            <PostGrid>
              {items.map((post) => (
                <PostGridItem key={post.id}>
                  <PostCard post={post} />
                </PostGridItem>
              ))}
            </PostGrid>

            <Pagination
              basePath={`/authors/${author.username}`}
              pagination={pagination}
              params={{}}
            />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No published posts yet.
          </p>
        )}
      </section>
    </div>
  );
}
