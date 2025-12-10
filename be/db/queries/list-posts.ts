import { getDb } from "../connection.ts";
import type { PostMeta } from "../../types/mod.ts";

interface ListPostsResult {
  posts: PostMeta[];
  total: number;
}

/**
 * List posts with pagination
 */
export function listPosts(page: number, perPage: number): ListPostsResult {
  const db = getDb();
  const offset = (page - 1) * perPage;

  // Get total count
  const countResult = db.prepare(`SELECT COUNT(*) as count FROM post_meta`).get() as { count: number };
  const total = countResult.count;

  // Get paginated posts
  const rows = db.prepare(`
    SELECT id, slug, author_id, status, created_at, updated_at, 
           content_reference_id, translation_group_id, category_ids, featured_image_id
    FROM post_meta 
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).all(perPage, offset) as {
    id: number;
    slug: string;
    author_id: number;
    status: string;
    created_at: string;
    updated_at: string;
    content_reference_id: string;
    translation_group_id: string;
    category_ids: string;
    featured_image_id: number | null;
  }[];

  const posts: PostMeta[] = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    author_id: row.author_id,
    status: row.status as PostMeta["status"],
    created_at: row.created_at,
    updated_at: row.updated_at,
    content_reference_id: row.content_reference_id,
    translation_group_id: row.translation_group_id,
    category_ids: JSON.parse(row.category_ids),
    featured_image_id: row.featured_image_id ?? undefined,
  }));

  return { posts, total };
}

