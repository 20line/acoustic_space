import { neon, neonConfig } from '@neondatabase/serverless'
import { PrismaNeonHTTP } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

// HTTP-based Neon driver: no TCP cold-start, works in Vercel serverless
neonConfig.fetchConnectionCache = true

function createPrismaClient(): PrismaClient {
  // Neon HTTP API requires the direct endpoint, not the PgBouncer pooler URL.
  // DIRECT_URL is the non-pooler connection string; fall back to DATABASE_URL
  // in environments where only one URL is configured (e.g. Vercel with a
  // direct-only DATABASE_URL).
  const connectionUrl = (process.env.DIRECT_URL || process.env.DATABASE_URL)!
  const sql = neon(connectionUrl)
  const adapter = new PrismaNeonHTTP(sql)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
export const prisma: PrismaClient =
  globalForPrisma.prisma ?? (globalForPrisma.prisma = createPrismaClient())

// Retry wrapper — Neon HTTP eliminates cold-start, but keep for transient errors.
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
