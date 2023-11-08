import { sql } from "drizzle-orm";
import {
  serial,
  index,
  pgTableCreator,
  timestamp,
  varchar,
  pgEnum,
  integer,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const pgTable = pgTableCreator((name) => `kanban_${name}`);

export const boards = pgTable("boards", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }),
  icon: text("icon"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Board = typeof boards.$inferSelect;
export type NewBoard = typeof boards.$inferInsert;
export const insertBoardSchema = createInsertSchema(boards, {
  icon: z.string().emoji().default("📝"),
});

export const statusEnum = pgEnum("status", ["todo", "in-progress", "done"]);

export const tasks = pgTable(
  "tasks",
  {
    id: serial("id").primaryKey(),
    title: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").defaultNow(),
    description: varchar("description", { length: 256 }),
    status: statusEnum("status"),
    boardId: integer("board_id")
      .notNull()
      .unique()
      .references(() => boards.id, { onDelete: "cascade" }),
  },
  (task) => ({
    titleIndex: index("title_idx").on(task.title),
  }),
);

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export const insertTaskSchema = createInsertSchema(tasks);
