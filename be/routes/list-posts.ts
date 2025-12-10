import { listPosts } from "../db/queries/mod.ts";
import { paginatedResponse, json } from "../utils/mod.ts";

const DEFAULT_PER_PAGE = 20;

/**
 * Handle GET /api/v1/posts
 */
export function handleListPosts(url: URL): Response {
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get("per_page") ?? String(DEFAULT_PER_PAGE), 10)));

  const { posts, total } = listPosts(page, perPage);

  return json(paginatedResponse(posts, page, perPage, total));
}

