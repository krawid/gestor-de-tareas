import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const lists = pgTable("lists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").notNull().default("#2563eb"),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  priority: integer("priority").notNull().default(0),
  listId: varchar("list_id").references(() => lists.id),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
});

export const insertListSchema = createInsertSchema(lists, {
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional().or(z.literal("")),
}).omit({
  id: true,
});

export const insertTaskSchema = createInsertSchema(tasks, {
  title: z.string().min(1, "El título es requerido"),
  startDate: z.union([z.string(), z.date(), z.null()]).transform((val) => {
    if (val === null || val === undefined) return null;
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }).optional(),
  endDate: z.union([z.string(), z.date(), z.null()]).transform((val) => {
    if (val === null || val === undefined) return null;
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }).optional(),
}).omit({
  id: true,
});

export type InsertList = z.infer<typeof insertListSchema>;
export type List = typeof lists.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
