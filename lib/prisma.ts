import { neon, neonConfig } from '@neondatabase/serverless'
import { PrismaNeonHTTP } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

neonConfig.fetchConnectionCache = true

// Lazy singleton — neon() must not be called at module evaluation time
// because env vars are absent during Next.js build-time static analysis.
let _client: PrismaClient | undefined

function getPrismaClient(): PrismaClient {
  if (_client) return _client
  // Neon HTTP API requires the direct endpoint, not the PgBouncer pooler.
  const connectionUrl = (process.env.DIRECT_URL || process.env.DATABASE_URL)!
  const sql = neon(connectionUrl)
  const adapter = new PrismaNeonHTTP(sql)
  _client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
  return _client
}

// Proxy keeps the same `prisma.model.method()` API for callers but defers
// the actual PrismaClient construction until the first property access.
export const prisma = new Proxy<PrismaClient>({} as PrismaClient, {
  get: (_target, prop: string | symbol) => {
    const client = getPrismaClient()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? (value as Function).bind(client) : value
  },
})

export async function dbRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < 3; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      const msg = err instanceof Error ? err.message : ''
      const isTransient =
        msg.includes('terminated') ||
        msg.includes('ECONNRESET') ||
        msg.includes('ECONNREFUSED') ||
        msg.includes('fetch failed') ||
        msg.includes('network')
      if (isTransient && i < 2) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)))
        continue
      }
      throw err
    }
  }
  throw lastErr
}
