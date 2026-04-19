import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const example = pgTable('example', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
