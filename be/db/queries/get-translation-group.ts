import { getDb } from "../connection.ts";
import type { TranslationGroup, Language } from "../../types/mod.ts";

/**
 * Get translation group by ID
 */
export function getTranslationGroupById(groupId: string): TranslationGroup | null {
  const db = getDb();

  // Get the group
  const group = db.prepare(`
    SELECT group_id, default_language
    FROM translation_group 
    WHERE group_id = ?
  `).get(groupId) as {
    group_id: string;
    default_language: string;
  } | undefined;

  if (!group) return null;

  // Get all translation entries for this group
  const entries = db.prepare(`
    SELECT language, post_id, title, meta_description, locale_specific_slug,
           translation_status, translated_by, translated_at
    FROM translation_entry 
    WHERE group_id = ?
  `).all(groupId) as {
    language: string;
    post_id: number;
    title: string;
    meta_description: string | null;
    locale_specific_slug: string | null;
    translation_status: string;
    translated_by: string | null;
    translated_at: string | null;
  }[];

  const translations: TranslationGroup["translations"] = {};

  for (const entry of entries) {
    const lang = entry.language as Language;
    translations[lang] = {
      post_id: entry.post_id,
      title: entry.title,
      meta_description: entry.meta_description ?? undefined,
      locale_specific_slug: entry.locale_specific_slug ?? undefined,
      translation_status: entry.translation_status as "complete" | "partial" | "machine" | "missing",
      translated_by: entry.translated_by ?? undefined,
      translated_at: entry.translated_at ?? undefined,
    };
  }

  return {
    group_id: group.group_id,
    default_language: group.default_language as Language,
    translations,
  };
}

