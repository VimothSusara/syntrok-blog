import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PostTaxonomy } from "@/components/blog/post-taxonomy";
import { TiptapViewer } from "@/components/editor/tiptap-viewer";
import { siteConfig } from "@/config/site";
import { getPublishedPostBySlug, incrementPostViewCount } from "@/lib/db/posts";
import { tiptapJsonToPlainText } from "@/lib/posts/content";
import { PostAuthorSection } from "@/components/blog/post-author-section";
import { CommentSection } from "@/components/blog/comment-section";
import { PostLikeSection } from "@/components/blog/post-like-section";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { publicBreadcrumbs } from "@/lib/breadcrumbs";
import { PostEngagementSection } from "@/components/blog/post-engagement-section";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  const description =
    post.summary?.trim() ||
    tiptapJsonToPlainText(post.content).slice(0, 160) ||
    siteConfig.description;

  const title = `${post.title} | ${siteConfig.name}`;
  const authorName = post.author.name ?? post.author.email;

  return {
    title,
    description,
    authors: [{ name: authorName }],
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `${siteConfig.url}/posts/${post.slug}`,
      siteName: siteConfig.name,
      publishedTime: post.publishedAt?.toISOString(),
      authors: [authorName],
      images: post.coverImageUrl
        ? [{ url: post.coverImageUrl, alt: post.title }]
        : [],
    },
    twitter: {
      card: post.coverImageUrl ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) notFound();

  await incrementPostViewCount(post.id);

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <PageBreadcrumb items={publicBreadcrumbs.post(post.title)} />

      <header className="space-y-4 border-b border-border pb-8">
        
        <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
          {post.title}
        </h1>

        <PostAuthorSection
          author={post.author}
          publishedAt={post.publishedAt}
        />

        <PostTaxonomy category={post.category} tags={post.tags} />

        {post.summary && (
          <p className="text-lg leading-relaxed text-muted-foreground">
            {post.summary}
          </p>
        )}
      </header>

      {post.coverImageUrl && (
        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl">
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <TiptapViewer content={post.content} />

      <PostEngagementSection postId={post.id} postSlug={post.slug} />

      <CommentSection postId={post.id} />
    </article>
  );
}
