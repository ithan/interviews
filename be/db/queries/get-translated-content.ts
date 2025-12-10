import { getDb } from "../connection.ts";
import type { TranslatedContent, Language } from "../../types/mod.ts";

/**
 * Get translated content by post ID and language (includes title)
 */
export function getTranslatedContent(postId: number, language: Language): TranslatedContent | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT post_id, language, title, html_content, excerpt, word_count, 
           translation_status, uses_fallback
    FROM translated_content 
    WHERE post_id = ? AND language = ?
  `).get(postId, language) as {
    post_id: number;
    language: string;
    title: string;
    html_content: string;
    excerpt: string | null;
    word_count: number;
    translation_status: string;
    uses_fallback: number;
  } | undefined;

  if (!row) return null;

  return {
    post_id: row.post_id,
    language: row.language as Language,
    title: row.title,
    html_content: row.html_content,
    excerpt: row.excerpt ?? undefined,
    word_count: row.word_count,
    translation_status: row.translation_status as TranslatedContent["translation_status"],
    uses_fallback: row.uses_fallback === 1,
  };
}
