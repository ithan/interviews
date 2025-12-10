import { Database } from "@db/sqlite";
import { SCHEMA } from "../db/schema.ts";
import { type Language } from "../types/mod.ts";
import {
  generateTitle,
  generateSlug,
  generateSimpleHtml,
  generatePastDate,
  generateUuid,
  getRandomLanguages,
  mockTranslate,
  randomInt,
  randomPick,
} from "../utils/mod.ts";

const TOTAL_POSTS = 200; // 10 pages × 20 posts per page

/**
 * Seed the database with mock data
 */
function seedDatabase(): void {
  console.log("🌱 Seeding database...");

  // Remove existing database
  try {
    Deno.removeSync("blog.db");
    console.log("🗑️  Removed existing database");
  } catch {
    // File doesn't exist, that's fine
  }

  const db = new Database("blog.db");

  try {
    // Create schema
    db.exec(SCHEMA);
    console.log("✅ Schema created");

    // Prepare statements
    const insertPostMeta = db.prepare(`
      INSERT INTO post_meta (slug, author_id, status, created_at, updated_at, content_reference_id, translation_group_id, category_ids, featured_image_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertContent = db.prepare(`
      INSERT INTO post_content (reference_id, html_body, excerpt, word_count, last_modified, revision_number)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertTranslationGroup = db.prepare(`
      INSERT INTO translation_group (group_id, default_language)
      VALUES (?, ?)
    `);

    const insertTranslationEntry = db.prepare(`
      INSERT INTO translation_entry (group_id, language, post_id, title, meta_description, locale_specific_slug, translation_status, translated_by, translated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertTranslatedContent = db.prepare(`
      INSERT INTO translated_content (post_id, language, translated_html, translation_quality_score, uses_fallback)
      VALUES (?, ?, ?, ?, ?)
    `);

    // Generate posts
    for (let i = 1; i <= TOTAL_POSTS; i++) {
      const title = generateTitle(i);
      const slug = generateSlug(title) + "-" + i;
      const authorId = randomInt(1, 10);
      const status = randomPick(["published", "published", "published", "draft", "archived"]);
      const createdAt = generatePastDate();
      const updatedAt = generatePastDate();
      const contentRefId = generateUuid();
      const translationGroupId = generateUuid();
      const categoryIds = JSON.stringify([randomInt(1, 10), randomInt(1, 10)]);
      const featuredImageId = Math.random() > 0.3 ? randomInt(1, 50) : null;

      // Insert post meta
      insertPostMeta.run(
        slug, authorId, status, createdAt, updatedAt,
        contentRefId, translationGroupId, categoryIds, featuredImageId
      );

      // Generate HTML content
      const htmlBody = generateSimpleHtml();
      const wordCount = htmlBody.split(/\s+/).length;
      const excerpt = htmlBody.replace(/<[^>]+>/g, "").slice(0, 150) + "...";

      // Insert content
      insertContent.run(
        contentRefId, htmlBody, excerpt, wordCount,
        updatedAt, randomInt(1, 5)
      );

      // Insert translation group
      insertTranslationGroup.run(translationGroupId, "en");

      // Get languages for this post
      const languages = getRandomLanguages();

      // Insert translations for each language
      for (const lang of languages) {
        const translatedTitle = mockTranslate(title, lang);
        const localeSlug = lang !== "en" ? `${lang}-${slug}` : null;
        const translationStatus = lang === "en"
          ? "complete"
          : randomPick(["complete", "complete", "partial", "machine"]);
        const translatedBy = lang !== "en" ? `translator-${randomInt(1, 5)}` : null;
        const translatedAt = lang !== "en" ? generatePastDate() : null;

        insertTranslationEntry.run(
          translationGroupId, lang, i, translatedTitle,
          `Meta description for ${translatedTitle}`,
          localeSlug, translationStatus, translatedBy, translatedAt
        );

        // Insert translated content
        const translatedHtml = lang === "en"
          ? htmlBody
          : mockTranslate(htmlBody, lang);
        const qualityScore = lang === "en" ? null : randomInt(70, 100) / 100;

        insertTranslatedContent.run(
          i, lang, translatedHtml, qualityScore, 0
        );
      }

      if (i % 50 === 0) {
        console.log(`📝 Created ${i}/${TOTAL_POSTS} posts...`);
      }
    }

    console.log(`✅ Successfully seeded ${TOTAL_POSTS} posts!`);
    console.log("📊 Database ready with:");
    console.log(`   - ${TOTAL_POSTS} posts`);
    console.log("   - Multiple translations per post");
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

