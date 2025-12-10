# Nightmare WordPress Blog API

A deliberately over-complicated blog API that simulates a legacy WordPress database structure where you need multiple API calls to get basic blog post data.

## Quick Start

```bash
# 1. Seed the database (creates 200 posts)
deno task seed

# 2. Start the server
deno task dev
```

Server will be available at `http://localhost:8000`

## Tasks

| Command | Description |
|---------|-------------|
| `deno task seed` | Initialize database and seed with 200 mock posts |
| `deno task dev` | Start server with watch mode |
| `deno task start` | Start server (production) |
| `deno task init-db` | Initialize empty database (no data) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/docs` | Swagger UI documentation |
| GET | `/openapi.json` | OpenAPI 3.0 specification |
| GET | `/api/v1/posts` | List posts (paginated, 20/page) |
| GET | `/api/v1/post-meta/:id` | Get post metadata |
| GET | `/api/v1/content/:refId` | Get post HTML content |
| GET | `/api/v1/translations/group/:groupId` | Get translation group |
| GET | `/api/v1/translations/content/:postId/:lang` | Get translated content |

## The Challenge

To get a complete blog post with all its data, you need to make **4+ API calls**:

```typescript
// Step 1: Get post meta to find content_reference_id and translation_group_id
const meta = await fetch(`/api/v1/post-meta/1`);

// Step 2: Get content using content_reference_id
const content = await fetch(`/api/v1/content/${meta.content_reference_id}`);

// Step 3: Get translation group to find titles for all languages
const translations = await fetch(`/api/v1/translations/group/${meta.translation_group_id}`);

// Step 4: Get translated content for each language
const translatedContent = await fetch(`/api/v1/translations/content/1/en`);
```

## Data Structure

- **200 posts** (10 pages × 20 posts per page)
- Multiple translations per post (en + 1-4 other languages)
- **Simple HTML content** - only these tags:
  - `<p>` paragraphs
  - `<h2>`, `<h3>`, `<h4>` headings
  - `<ul>` / `<li>` lists

## HTML to JSON Blocks

The HTML content is intentionally simple (1 depth only) for easy transformation:

**Input HTML:**
```html
<h2>Getting Started</h2>
<p>Lorem ipsum dolor sit amet.</p>
<ul>
  <li>First item</li>
  <li>Second item</li>
</ul>
```

## Supported Languages

| Code | Language |
|------|----------|
| `en` | English (default) |
| `fr` | French |
| `de` | German |
| `es` | Spanish |
| `it` | Italian |
| `cs` | Czech |
| `pl` | Polish |
| `jp` | Japanese |

## Project Structure

```
be/
├── deno.json           # Deno configuration
├── server.ts           # Main server entry point
├── mod.ts              # Main exports
├── openapi.ts          # OpenAPI specification
├── db/
│   ├── connection.ts   # Database connection
│   ├── schema.ts       # SQL schema
│   └── queries/        # One query per file
│       ├── get-post-meta.ts
│       ├── get-content.ts
│       ├── get-translation-group.ts
│       ├── get-translated-content.ts
│       └── list-posts.ts
├── routes/             # Route handlers
│   ├── post-meta.ts
│   ├── content.ts
│   ├── translation-group.ts
│   ├── translated-content.ts
│   └── list-posts.ts
├── scripts/
│   ├── init-db.ts      # Database initialization
│   └── seed.ts         # Data seeding
├── types/
│   └── api.ts          # TypeScript types
└── utils/
    ├── response.ts     # API response helpers
    └── generate-mock.ts # Mock data generation
```

## Example Responses

### List Posts
```bash
curl http://localhost:8000/api/v1/posts?page=1&per_page=20
```

### Get Post Meta
```bash
curl http://localhost:8000/api/v1/post-meta/1
```

### Get Content
```bash
curl http://localhost:8000/api/v1/content/<content_reference_id>
```

### Get Translation Group
```bash
curl http://localhost:8000/api/v1/translations/group/<translation_group_id>
```

### Get Translated Content
```bash
curl http://localhost:8000/api/v1/translations/content/1/en
```

