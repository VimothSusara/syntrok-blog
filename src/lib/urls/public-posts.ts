import { buildQueryString } from "@/lib/urls/search-params";

export function postsFilterUrl(filter: {
  category?: string;
  tag?: string;
  /** Public username for author filter */
  author?: string;
}) {
  return `/posts${buildQueryString({
    category: filter.category,
    tag: filter.tag,
    author: filter.author,
  })}`;
}

/** Prefer username in post filter links */
export function authorPostsFilterUrl(author: {
  username: string | null;
  id: string;
}) {
  return postsFilterUrl({
    author: author.username ?? author.id,
  });
}
