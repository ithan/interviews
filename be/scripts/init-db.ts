import { Database } from "@db/sqlite";
import { SCHEMA } from "../db/schema.ts";

/**
 * Initialize the database with the schema
 */
function initDatabase(): void {
  console.log("🗄️  Initializing database...");

  const db = new Database("blog.db");

  try {
    db.exec(SCHEMA);
    console.log("✅ Database schema created successfully!");
  } catch (error) {
    console.error("❌ Failed to create schema:", error);
    throw error;
  } finally {
    db.close();
  }
}

// Run if this is the main module
if (import.meta.main) {
  initDatabase();
}

export { initDatabase };

