import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  lastActiveAt: text("last_active_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const titles = sqliteTable("titles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  type: text("type", { enum: ["movie", "series"] }).notNull(),
  year: integer("year").notNull(),
  saga: text("saga").notNull(),
  phase: text("phase", { enum: ["Phase 1", "Phase 2", "Phase 3", "Phase 4", "Phase 5", "Phase 6"] }),
  subgroup: text("subgroup"),
  blurb: text("blurb").notNull().default(""),
  sortOrder: integer("sort_order").notNull(),
  essentialDoomsday: integer("essential_doomsday", { mode: "boolean" }).notNull().default(false),
  essentialBrandNewDay: integer("essential_brand_new_day", { mode: "boolean" }).notNull().default(false),
  essentialDeadpoolWolverine: integer("essential_deadpool_wolverine", { mode: "boolean" }).notNull().default(false),
  badgeReason: text("badge_reason"),
  episodeNote: text("episode_note"),
  isReleased: integer("is_released", { mode: "boolean" }).notNull().default(true),
  isOptional: integer("is_optional", { mode: "boolean" }).notNull().default(false),
});

export const progress = sqliteTable(
  "progress",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    titleId: integer("title_id")
      .notNull()
      .references(() => titles.id, { onDelete: "cascade" }),
    watched: integer("watched", { mode: "boolean" }).notNull().default(false),
    updatedAt: text("updated_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => [primaryKey({ columns: [table.userId, table.titleId] })]
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(progress),
}));

export const titlesRelations = relations(titles, ({ many }) => ({
  progress: many(progress),
}));

export const progressRelations = relations(progress, ({ one }) => ({
  user: one(users, {
    fields: [progress.userId],
    references: [users.id],
  }),
  title: one(titles, {
    fields: [progress.titleId],
    references: [titles.id],
  }),
}));
