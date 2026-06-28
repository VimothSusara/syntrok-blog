export function authorProfileUrl(author: { username: string | null }) {
  if (!author.username) return null;
  return `/authors/${author.username}`;
}
