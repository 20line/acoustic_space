import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

// ─────────────────────────────────────────────────────────────────────────────
// Neon free tier suspends compute when idle, which drops TCP connections and
// makes the HTTP/WebSocket adapters fail (the HTTP adapter also cannot run the
// transactions that Prisma `include`/nested writes need — that broke the cart
// and order APIs). A pg.Pool pointed at Neon's PgBouncer *pooler* URL plus a
// small retry wrapper is the stable combination. See memory: feedback-db-neon.
// ─────────────────────────────────────────────────────────────────────────────

let _client: PrismaClient | undefined

function getPrismaClient(): PrismaClient {
  if (_client) return _client

  // Pooler URL (…-pooler…?pgbouncer=true&sslmode=require) — survives cold starts.
  const connectionString = (process.env.DATABASE_URL || process.env.DIRECT_URL)!

  const pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    // Neon free-tier compute cold-starts can take 10s+; give the first
    // connection room before the retry wrapper takes over.
    connectionTimeoutMillis: 20_000,
    keepAlive: true,
  })
  // Neon drops idle connections; swallow the resulting async error events so
  // they don't crash the process — the retry wrapper re-runs the query.
  pool.on('error', () => {})

  const adapter = new PrismaPg(pool)
  _client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
  return _client
}

// Proxy keeps the `prisma.model.method()` API but defers client construction
// until first access (env vars are absent during build-time static analysis).
export const prisma = new Proxy<PrismaClient>({} as PrismaClient, {
  get: (_target, prop: string | symbol) => {
    const client = getPrismaClient()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? (value as Function).bind(client) : value
  },
})

export async function dbRetry<T>(fn: () => Promise<T>): Promise<T> {
  const MAX_ATTEMPTS = 4
  let lastErr: unknown
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      const msg = err instanceof Error ? err.message : ''
      const isTransient =
        msg.includes('terminated') ||
        msg.includes('Connection terminated') ||
        msg.includes('ECONNRESET') ||
        msg.includes('ECONNREFUSED') ||
        msg.includes('ETIMEDOUT') ||
        msg.includes('fetch failed') ||
        msg.includes('timeout') ||
        msg.includes('Timed out') ||
        msg.includes('Closed') ||
        msg.includes('network')
      if (isTransient && i < MAX_ATTEMPTS - 1) {
        // Neon compute may still be waking — back off progressively.
        await new Promise((r) => setTimeout(r, 1500 * (i + 1)))
        continue
      }
      throw err
    }
  }
  throw lastErr
}
