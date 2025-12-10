/**
 * SQL schema for the blog database (simplified)
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
  category_ids TEXT NOT NULL, -- JSON array
  featured_image_id INTEGER,
  default_language TEXT NOT NULL DEFAULT 'en'
);

-- Translated content table (includes title and content per language)
CREATE TABLE IF NOT EXISTS translated_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  language TEXT NOT NULL,
  title TEXT NOT NULL,
  html_content TEXT NOT NULL,
  excerpt TEXT,
  word_count INTEGER NOT NULL,
  translation_status TEXT NOT NULL CHECK (translation_status IN ('complete', 'partial', 'machine')),
  uses_fallback INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (post_id) REFERENCES post_meta(id),
  UNIQUE (post_id, language)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_post_meta_slug ON post_meta(slug);
CREATE INDEX IF NOT EXISTS idx_post_meta_status ON post_meta(status);
CREATE INDEX IF NOT EXISTS idx_translated_content_post ON translated_content(post_id);
CREATE INDEX IF NOT EXISTS idx_translated_content_lang ON translated_content(language);
`;
