import {
  timestamp,
  date,
  text,
  varchar,
  pgTable,
  uuid,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  first_name: varchar({ length: 120 }).notNull(),
  last_name: varchar({ length: 120 }).notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  password_hash: text().notNull(),
  date_of_birth: date(),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp().$onUpdate(() => new Date()),
});
