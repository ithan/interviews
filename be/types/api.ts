/**
 * Available languages in the system
 */
export type Language = "en" | "fr" | "de" | "es" | "it" | "cs" | "pl" | "jp";

export const LANGUAGES: Language[] = ["en", "fr", "de", "es", "it", "cs", "pl", "jp"];

/**
 * Translation info for a post
 */
export interface TranslationInfo {
  language: Language;
  post_id: number;
  title: string;
  translation_status: "complete" | "partial" | "machine";
}

/**
 * POST META ENDPOINT: /api/v1/post-meta/{id}
 * Contains post metadata AND available translations
 */
export interface PostMeta {
  id: number;
  slug: string;
  author_id: number;
  status: "published" | "draft" | "archived";
  created_at: string;
  updated_at: string;
  category_ids: number[];
  featured_image_id?: number;
  default_language: Language;
  available_translations: TranslationInfo[];
}

/**
 * TRANSLATED CONTENT ENDPOINT: /api/v1/translations/content/{post_id}/{language}
 * Contains title AND translated HTML content
 */
export interface TranslatedContent {
  post_id: number;
  language: Language;
  title: string;
  html_content: string;
  excerpt?: string;
  word_count: number;
  translation_status: "complete" | "partial" | "machine";
  uses_fallback: boolean;
}

/**
 * The final shape for a complete blog post
 */
export interface BlogPostData {
  slug: string;
  title: string;
  content: string;
  language: Language;
  translations: {
    [K in Language]?: {
      slug: string;
      title: string;
      content: string;
    };
  };
}

/**
 * Helper type for JSON blocks conversion
 */
export interface JsonBlock {
  type: "paragraph" | "heading" | "list";
  content: string;
  attributes?: Record<string, unknown>;
  children?: JsonBlock[];
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    request_id: string;
  };
}

/**
 * API Error response
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: {
    timestamp: string;
    request_id: string;
  };
}

/**
 * Paginated list response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  meta: {
    timestamp: string;
    request_id: string;
  };
}
