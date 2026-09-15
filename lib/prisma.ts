import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'

// ─────────────────────────────────────────────────────────────────────────────
// Transport: Neon serverless driver over WebSocket (wss://, port 443).
//
// Why not raw pg over TCP 5432: from some networks (incl. RU ISPs with DPI) the
// Postgres TLS handshake on 5432 intermittently hangs while 443 sails through —
// the site "loads 2–3 times, then stops". Port 443 also survives serverless
// cold starts far better. Why not the HTTP-only adapter: it can't run
// transactions, which Prisma nested writes (orders + items) need.
//
// poolQueryViaFetch = plain single queries go over stateless HTTPS (fast, no
// connection held); only real transactions open a WebSocket.
// ─────────────────────────────────────────────────────────────────────────────

neonConfig.webSocketConstructor = ws
neonConfig.poolQueryViaFetch = true

let _client: PrismaClient | undefined

function getPrismaClient(): PrismaClient {
  if (_client) return _client

  // The serverless driver talks to the compute endpoint directly (fetch mode
  // needs the non-pooler host); it multiplexes on Neon's side.
  const connectionString = (process.env.DIRECT_URL || process.env.DATABASE_URL)!

  const pool = new Pool({
    connectionString,
    max: 3,
    idleTimeoutMillis: 20_000,
    // Fail fast — a slow/hung connect must not stall a request for a minute.
    connectionTimeoutMillis: 8_000,
  })
  pool.on('error', () => {})

  const adapter = new PrismaNeon(pool)
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

// Retry only genuinely transient failures, and keep the total budget short:
// a request that can't reach the DB should fail in seconds, not minutes.
export async function dbRetry<T>(fn: () => Promise<T>): Promise<T> {
  const MAX_ATTEMPTS = 3
  let lastErr: unknown
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      const msg = err instanceof Error ? err.message : ''
      const isTransient =
        msg.includes('terminated') ||
        msg.includes('ECONNRESET') ||
        msg.includes('ECONNREFUSED') ||
        msg.includes('ETIMEDOUT') ||
        msg.includes('fetch failed') ||
        msg.includes('timeout') ||
        msg.includes('Timed out') ||
        msg.includes('WebSocket') ||
        msg.includes('network')
      if (isTransient && i < MAX_ATTEMPTS - 1) {
        await new Promise((r) => setTimeout(r, 500 * (i + 1)))
        continue
      }
      throw err
    }
  }
  throw lastErr
}
