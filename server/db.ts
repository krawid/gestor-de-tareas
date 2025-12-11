import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Only initialize database if DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not set. Database connection will not be initialized.");
}

export const pool = process.env.DATABASE_URL 
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

export const db = pool 
  ? drizzle(pool, { schema })
  : null;
