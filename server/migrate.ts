import { pool } from "./db";

export async function runMigrations() {
  if (!pool) {
    console.log("⏭️  No database connection, skipping migrations");
    return;
  }

  try {
    console.log("🔄 Checking for pending migrations...");

    // Check if due_date column exists
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tasks' AND column_name = 'due_date'
    `);

    if (checkColumn.rows.length > 0) {
      console.log("📦 Found old schema with due_date column, migrating...");

      // Run migration
      await pool.query(`
        ALTER TABLE tasks ADD COLUMN IF NOT EXISTS start_date TIMESTAMP;
        ALTER TABLE tasks ADD COLUMN IF NOT EXISTS end_date TIMESTAMP;
        UPDATE tasks SET end_date = due_date WHERE due_date IS NOT NULL;
        ALTER TABLE tasks DROP COLUMN IF EXISTS due_date;
      `);

      console.log("✅ Migration completed successfully!");
    } else {
      console.log("✅ Database schema is up to date");
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}
