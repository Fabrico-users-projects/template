import { createFabricoDrizzle } from '@fabrico/sdk'
import { getFabrico } from './fabrico'

export function createDb(env: Env) {
  const fabrico = getFabrico(env)
  return createFabricoDrizzle(fabrico) as any
}