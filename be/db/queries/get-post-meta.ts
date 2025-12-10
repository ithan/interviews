import { getDb } from "../connection.ts";
import type { PostMeta, TranslationInfo, Language } from "../../types/mod.ts";

/**
 * Get post metadata by ID (includes available translations)
 */
export function getPostMetaById(id: number): PostMeta | null {
  const db = getDb();
  
  // Get post meta
  const row = db.prepare(`
    SELECT id, slug, author_id, status, created_at, updated_at, 
           category_ids, featured_image_id, default_language
    FROM post_meta 
    WHERE id = ?
  `).get(id) as {
    id: number;
    slug: string;
    author_id: number;
    status: string;
    created_at: string;
    updated_at: string;
    category_ids: string;
    featured_image_id: number | null;
    default_language: string;
  } | undefined;

  if (!row) return null;

  // Get available translations
  const translations = db.prepare(`
    SELECT language, post_id, title, translation_status
    FROM translated_content 
    WHERE post_id = ?
    ORDER BY language
  `).all(id) as {
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
}
