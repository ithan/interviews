import { getDb } from "../connection.ts";
import type { TranslatedContent, Language } from "../../types/mod.ts";

/**
 * Get translated content by post ID and language
 */
export function getTranslatedContent(postId: number, language: Language): TranslatedContent | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT post_id, language, translated_html, translation_quality_score, uses_fallback
    FROM translated_content 
    WHERE post_id = ? AND language = ?
  `).get(postId, language) as {
    post_id: number;
    language: string;
    translated_html: string;
    translation_quality_score: number | null;
    uses_fallback: number;
  } | undefined;

  if (!row) return null;

  return {
    post_id: row.post_id,
    language: row.language as Language,
    translated_html: row.translated_html,
    translation_quality_score: row.translation_quality_score ?? undefined,
    uses_fallback: row.uses_fallback === 1,
  };
}

