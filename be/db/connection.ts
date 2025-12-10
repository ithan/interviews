import { Database } from "@db/sqlite";

let db: Database | null = null;

/**
 * Get or create the database connection
 */
export function getDb(): Database {
  if (!db) {
    db = new Database("blog.db");
  }
  return db;
}

/**
 * Close the database connection
 */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

