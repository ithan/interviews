import { getDb } from "../connection.ts";
import type { PostMeta, TranslationInfo, Language } from "../../types/mod.ts";

interface ListPostsResult {
  posts: PostMeta[];
  total: number;
}

/**
 * List posts with pagination (includes available translations for each)
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
           category_ids, featured_image_id, default_language
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
    category_ids: string;
    featured_image_id: number | null;
    default_language: string;
  }[];

  const posts: PostMeta[] = rows.map((row) => {
    // Get available translations for each post
    const translations = db.prepare(`
      SELECT language, post_id, title, translation_status
      FROM translated_content 
      WHERE post_id = ?
      ORDER BY language
    `).all(row.id) as {
      language: string;
      post_id: number;
      title: string;
      translation_status: string;
    }[];

    const availableTranslations: TranslationInfo[] = translations.map((t) => ({
      language: t.language as Language,
      post_id: t.post_id,
      title: t.title,
      translation_status: t.translation_status as TranslationInfo["translation_status"],
    }));

    return {
      id: row.id,
      slug: row.slug,
      author_id: row.author_id,
      status: row.status as PostMeta["status"],
      created_at: row.created_at,
      updated_at: row.updated_at,
      category_ids: JSON.parse(row.category_ids),
      featured_image_id: row.featured_image_id ?? undefined,
      default_language: row.default_language as Language,
      available_translations: availableTranslations,
    };
  });

  return { posts, total };
}
