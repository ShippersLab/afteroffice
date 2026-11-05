import { pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    handle: varchar("handle", { length: 32 }).notNull(),
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("accounts_handle_unique").on(table.handle),
    uniqueIndex("accounts_token_hash_unique").on(table.tokenHash),
  ],
).enableRLS();

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
