import { NextResponse } from 'next/server'
import type { Session } from 'next-auth'

export function adminGuard(session: Session | null): NextResponse | null {
  const role = (session?.user as { role?: string } | undefined)?.role
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}
