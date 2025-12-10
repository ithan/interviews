import { getDb } from "../connection.ts";
import type { PostContent } from "../../types/mod.ts";

/**
 * Get post content by reference ID
 */
export function getContentByRefId(referenceId: string): PostContent | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT reference_id, html_body, excerpt, word_count, last_modified, revision_number
    FROM post_content 
    WHERE reference_id = ?
  `).get(referenceId) as {
    reference_id: string;
    html_body: string;
    excerpt: string | null;
    word_count: number;
    last_modified: string;
    revision_number: number;
  } | undefined;

  if (!row) return null;

  return {
    reference_id: row.reference_id,
    html_body: row.html_body,
    excerpt: row.excerpt ?? undefined,
    word_count: row.word_count,
    last_modified: row.last_modified,
    revision_number: row.revision_number,
  };
}

