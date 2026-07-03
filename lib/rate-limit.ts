interface Entry {
  count: number
  resetAt: number
}

declare global {
  // eslint-disable-next-line no-var
  var __rateLimitStore: Map<string, Entry> | undefined
  // eslint-disable-next-line no-var
  var __rateLimitTimer: ReturnType<typeof setInterval> | undefined
}

// Use globalThis to survive HMR reloads in Next.js dev mode
const store: Map<string, Entry> = (globalThis.__rateLimitStore ??= new Map())

if (!globalThis.__rateLimitTimer) {
  globalThis.__rateLimitTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (entry.resetAt < now) store.delete(key)
    }
  }, 5 * 60 * 1000)
}

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}
