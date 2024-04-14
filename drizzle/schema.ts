import {
  pgTable,
  foreignKey,
  pgEnum,
  serial,
  integer,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const keyStatus = pgEnum("key_status", [
  "expired",
  "invalid",
  "valid",
  "default",
]);
export const keyType = pgEnum("key_type", [
  "stream_xchacha20",
  "secretstream",
  "secretbox",
  "kdf",
  "generichash",
  "shorthash",
  "auth",
  "hmacsha256",
  "hmacsha512",
  "aead-det",
  "aead-ietf",
]);
export const aalLevel = pgEnum("aal_level", ["aal3", "aal2", "aal1"]);
export const codeChallengeMethod = pgEnum("code_challenge_method", [
  "plain",
  "s256",
]);
export const factorStatus = pgEnum("factor_status", ["verified", "unverified"]);
export const factorType = pgEnum("factor_type", ["webauthn", "totp"]);
export const equalityOp = pgEnum("equality_op", [
  "in",
  "gte",
  "gt",
  "lte",
  "lt",
  "neq",
  "eq",
]);
export const action = pgEnum("action", [
  "ERROR",
  "TRUNCATE",
  "DELETE",
  "UPDATE",
  "INSERT",
]);

export const items = pgTable("items", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name"),
  price: integer("price"),
  description: text("description"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  fullName: text("full_name"),
  phone: varchar("phone", { length: 256 }).default(
    sql`NULL::character varying`,
  ),
});
