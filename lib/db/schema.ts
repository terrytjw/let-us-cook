import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  fullName: text("fullName").notNull(),
  email: text("email").notNull(),
  isAdmin: boolean("isAdmin").notNull().default(false),
  aiMessagesLeft: integer("aiMessagesLeft").notNull().default(50),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  userId: text("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  description: text("description").notNull(),
});

export const threads = pgTable("threads", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  firstMessage: text("firstMessage").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});
