import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  fullName: text("fullName").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name"),
  price: integer("price"),
  description: text("description"),
});
