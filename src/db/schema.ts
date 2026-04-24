import { relations, type InferInsertModel } from "drizzle-orm";
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
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const rolesEnum = pgEnum("user_role", ["user", "admin"]);
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  age: integer("age").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: rolesEnum("role").default("user"),
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

export const userRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}));

export const taskRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));

// Zod Schemas
export const userInsertSchema = createInsertSchema(users, {
  email: z.email({
    message: "Invalid email format.",
  }),
}).omit({
  id: true,
});
export const loginSchema = userInsertSchema.omit({ age: true, name: true });
export const taskInsertSchema = createInsertSchema(tasks).omit({
  userId: true,
});
export const tagsInsertSchema = createInsertSchema(tags);
export const updateUserSchema = userInsertSchema
  .partial()
  // NB: refine() is for performing custom validation
  .refine((data) => Object.values(data).some((val) => val != undefined), {
    error: "At least one property must be provided",
  });
export const updateTaskSchema = taskInsertSchema
  .partial()
  .refine((data) => Object.values(data).some((val) => val != undefined), {
    error: "At least one property must be provided",
  });
export const updateTagsSchema = tagsInsertSchema
  .partial()
  .refine((data) => Object.values(data).some((val) => val != undefined), {
    error: "At least one property must be provided",
  });
