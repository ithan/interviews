import { Database } from "@db/sqlite";
import { SCHEMA, getDbPath } from "../db/mod.ts";
import {
  generateTitle,
  generateSlug,
  generateSimpleHtml,
  generatePastDate,
  getRandomLanguages,
  translateTitle,
  randomInt,
  randomPick,
} from "../utils/mod.ts";

const TOTAL_POSTS = 200; // 10 pages × 20 posts per page

/**
 * Seed the database with mock data
 */
function seedDatabase(): void {
  const dbPath = getDbPath();
  console.log(`🌱 Seeding database at ${dbPath}...`);

  // Ensure directory exists
  const dir = dbPath.includes("/") ? dbPath.substring(0, dbPath.lastIndexOf("/")) : null;
  if (dir) {
    try {
      Deno.mkdirSync(dir, { recursive: true });
    } catch {
      // Directory might already exist
    }
  }

  // Remove existing database
  try {
    Deno.removeSync(dbPath);
    console.log("🗑️  Removed existing database");
  } catch {
    // File doesn't exist, that's fine
  }

  const db = new Database(dbPath);

  try {
    // Create schema
    db.exec(SCHEMA);
    console.log("✅ Schema created");

    // Prepare statements
    const insertPostMeta = db.prepare(`
      INSERT INTO post_meta (slug, author_id, status, created_at, updated_at, category_ids, featured_image_id, default_language)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertTranslatedContent = db.prepare(`
      INSERT INTO translated_content (post_id, language, title, html_content, excerpt, word_count, translation_status, uses_fallback)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Generate posts
    for (let i = 1; i <= TOTAL_POSTS; i++) {
      const title = generateTitle(i);
      const slug = generateSlug(title, i);
      const authorId = randomInt(1, 10);
      const status = randomPick(["published", "published", "published", "draft", "archived"]);
      const createdAt = generatePastDate();
      const updatedAt = generatePastDate();
      const categoryIds = JSON.stringify([randomInt(1, 10), randomInt(1, 10)]);
      const featuredImageId = Math.random() > 0.3 ? randomInt(1, 50) : null;

      // Insert post meta
      insertPostMeta.run(
        slug, authorId, status, createdAt, updatedAt,
        categoryIds, featuredImageId, "en"
      );

      // Get languages for this post
      const languages = getRandomLanguages();

      // Insert translated content for each language
      for (const lang of languages) {
        const translatedTitle = translateTitle(title, lang);
        const htmlContent = generateSimpleHtml();
        const wordCount = htmlContent.split(/\s+/).length;
        const excerpt = htmlContent.replace(/<[^>]+>/g, "").slice(0, 150) + "...";
        const translationStatus = lang === "en"
          ? "complete"
          : randomPick(["complete", "complete", "partial", "machine"]);

        insertTranslatedContent.run(
          i, lang, translatedTitle, htmlContent, excerpt,
          wordCount, translationStatus, 0
        );
      }

      if (i % 50 === 0) {
        console.log(`📝 Created ${i}/${TOTAL_POSTS} posts...`);
      }
    }

    console.log(`✅ Successfully seeded ${TOTAL_POSTS} posts!`);
    console.log("📊 Database ready with:");
    console.log(`   - ${TOTAL_POSTS} posts`);
    console.log("   - 3-6 translations per post");
    console.log("   - Simple HTML content (paragraphs, headings, lists)");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    db.close();
  }
}

// Run if this is the main module
if (import.meta.main) {
  seedDatabase();
}

export { seedDatabase };
