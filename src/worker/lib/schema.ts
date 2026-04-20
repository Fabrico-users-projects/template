import { pgSchema, uuid, text, timestamp } from 'drizzle-orm/pg-core'

const neonAuth = pgSchema('neon_auth')

export const authUsers = neonAuth.table('users_sync', {
  id: uuid('id').primaryKey(),
  email: text('email'),
  name: text('name'),
  createdAt: timestamp('created_at'),
})