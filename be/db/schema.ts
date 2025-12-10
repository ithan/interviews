/**
 * SQL schema for the blog database
 */
export const SCHEMA = `
-- Post metadata table
CREATE TABLE IF NOT EXISTS post_meta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  author_id INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('published', 'draft', 'archived')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  content_reference_id TEXT NOT NULL,
  translation_group_id TEXT NOT NULL,
  category_ids TEXT NOT NULL, -- JSON array
  featured_image_id INTEGER
);

-- Content table
CREATE TABLE IF NOT EXISTS post_content (
  reference_id TEXT PRIMARY KEY,
  html_body TEXT NOT NULL,
  excerpt TEXT,
  word_count INTEGER NOT NULL,
  last_modified TEXT NOT NULL,
  revision_number INTEGER NOT NULL
);

-- Translation groups table
CREATE TABLE IF NOT EXISTS translation_group (
  group_id TEXT PRIMARY KEY,
  default_language TEXT NOT NULL
);

-- Translation entries table
CREATE TABLE IF NOT EXISTS translation_entry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id TEXT NOT NULL,
  language TEXT NOT NULL,
  post_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT,
  locale_specific_slug TEXT,
  translation_status TEXT NOT NULL CHECK (translation_status IN ('complete', 'partial', 'machine', 'missing')),
  translated_by TEXT,
  translated_at TEXT,
  FOREIGN KEY (group_id) REFERENCES translation_group(group_id),
  UNIQUE (group_id, language)
);

-- Translated content table
CREATE TABLE IF NOT EXISTS translated_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  language TEXT NOT NULL,
  translated_html TEXT NOT NULL,
  translation_quality_score REAL,
  uses_fallback INTEGER NOT NULL DEFAULT 0,
  UNIQUE (post_id, language)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_post_meta_slug ON post_meta(slug);
CREATE INDEX IF NOT EXISTS idx_post_meta_status ON post_meta(status);
CREATE INDEX IF NOT EXISTS idx_translation_entry_group ON translation_entry(group_id);
CREATE INDEX IF NOT EXISTS idx_translated_content_post ON translated_content(post_id);
`;

