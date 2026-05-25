import { getFabrico } from './fabrico'
import { createFabricoDrizzle } from 'fabrico-sdk/drizzle'

export function createDb(env: Env) {
  const fabrico = getFabrico(env)
  return createFabricoDrizzle(fabrico) as any
}