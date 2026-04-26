import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'
import { env } from 'cloudflare:workers'

export function createDb() {
  const databaseUrl = env.DATABASE_URL
  const sql = neon(databaseUrl)
  return drizzle(sql, { schema })
}