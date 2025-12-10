import { getDb } from "../connection.ts";
import type { PostMeta } from "../../types/mod.ts";

/**
 * Get post metadata by ID
 */
export function getPostMetaById(id: number): PostMeta | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT id, slug, author_id, status, created_at, updated_at, 
           content_reference_id, translation_group_id, category_ids, featured_image_id
    FROM post_meta 
    WHERE id = ?
  `).get(id) as {
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
  } | undefined;

  if (!row) return null;

  return {
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
  };
}

