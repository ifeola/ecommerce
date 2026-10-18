import {
  timestamp,
  date,
  text,
  varchar,
  pgTable,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["male", "female"]);
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  first_name: varchar({ length: 120 }).notNull(),
  last_name: varchar({ length: 120 }).notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  password_hash: text().notNull(),
  date_of_birth: date(),
  gender: genderEnum(),
  role: roleEnum().notNull().default("user"),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PublicUser = Omit<User, "password_hash">;
