import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  age: integer("age").notNull(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  summary: varchar("summary", { length: 100 }).notNull(),
  details: text("details"),
  completed: boolean("completed").default(false),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
});
export const tagsEnum = pgEnum("tag_names", ["UI/UX", "FE", "BE", "DevOps"]);
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: tagsEnum("tag_names").default("BE"),
  color: varchar("color", { length: 100 }),
});

export const taskTags = pgTable(
  "task_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskId: uuid("task_id")
      .references(() => tasks.id)
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => tags.id)
      .notNull(),
  },
  (t) => [unique("custom_name").on(t.tagId, t.taskId)],
);
