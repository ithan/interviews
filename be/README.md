# Blog API

Multilingual blog API with simple HTML content.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BE_PORT` | `8000` | Server port |
| `DB_PATH` | `blog.db` | SQLite database path |

---

## API Reference

Base URL: `http://localhost:8000`

### Response Format

All responses follow this structure:

**Success Response**
```typescript
{
  success: true,
  data: T,  // Response data (type depends on endpoint)
  meta: {
    timestamp: string,  // ISO 8601
    request_id: string  // UUID
  }
}
```

**Error Response**
```typescript
{
  success: false,
  error: {
    code: string,      // e.g. "NOT_FOUND", "INVALID_LANGUAGE"
    message: string,
    details?: unknown
  },
  meta: {
    timestamp: string,
    request_id: string
  }
}
```

**Paginated Response**
```typescript
{
  success: true,
  data: T[],
  pagination: {
    page: number,
    per_page: number,
    total: number,
    total_pages: number
  },
  meta: {
    timestamp: string,
    request_id: string
  }
}
```

---

## Endpoints

### `GET /api/v1/posts`

List all posts with available translations.

**Parameters**

| Name | In | Type | Default | Description |
|------|-----|------|---------|-------------|
| `page` | query | integer | 1 | Page number (1-indexed) |
| `per_page` | query | integer | 20 | Items per page (max 100) |

**Response: `PaginatedResponse<PostMeta>`**

---

### `GET /api/v1/post-meta/{id}`

Get post metadata including all available translations.

**Parameters**

| Name | In | Type | Description |
|------|-----|------|-------------|
| `id` | path | integer | Post ID |

**Response: `ApiResponse<PostMeta>`**

Use `available_translations[].language` to know which languages are available, then fetch content via `/api/v1/translations/content/{id}/{language}`.

**Errors**
- `404` - Post not found

---

### `GET /api/v1/translations/content/{postId}/{language}`

Get translated title and HTML content for a specific language.

**Parameters**

| Name | In | Type | Description |
|------|-----|------|-------------|
| `postId` | path | integer | Post ID |
| `language` | path | string | Language code |

**Response: `ApiResponse<TranslatedContent>`**

**Errors**
- `400` - Invalid language code
- `404` - Translation not found for this post/language

---

## Types

### `Language`

```typescript
type Language = "en" | "fr" | "de" | "es" | "it" | "cs" | "pl" | "jp";
```

### `PostMeta`

```typescript
interface PostMeta {
  id: number;
  slug: string;
  author_id: number;
  status: "published" | "draft" | "archived";
  created_at: string;           // ISO 8601
  updated_at: string;           // ISO 8601
  category_ids: number[];
  featured_image_id?: number;
  default_language: Language;
  available_translations: TranslationInfo[];
}
```

### `TranslationInfo`

```typescript
interface TranslationInfo {
  language: Language;
  post_id: number;              // Use this to fetch content
  title: string;
  translation_status: "complete" | "partial" | "machine";
}
```

### `TranslatedContent`

```typescript
interface TranslatedContent {
  post_id: number;
  language: Language;
  title: string;
  html_content: string;         // Simple HTML: <p>, <h2>, <h3>, <ul>, <li>, also you may need to handle text outside any tag like: [demo] <p> lorem ipsum </p> <ul> <li> item 1 </li> <li> item 2 </li> </ul>
  excerpt?: string;
  word_count: number;
  translation_status: "complete" | "partial" | "machine";
  uses_fallback: boolean;
}
```

---

## OpenAPI

Interactive documentation available at `/docs`

OpenAPI 3.0 spec available at `/openapi.json`
