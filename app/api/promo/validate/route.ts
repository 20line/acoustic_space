import { NextRequest, NextResponse } from 'next/server'
import { prisma, dbRetry } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'

const INVALID_MSG = 'Промокод недействителен'

// POST /api/promo/validate  { code, subtotal }
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(ip, 10, 60_000)) {
    return NextResponse.json({ error: 'Слишком много попыток. Попробуйте позже.' }, { status: 429 })
  }

  const { code, subtotal } = await req.json()
  if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 })

  const promo = await dbRetry(() =>
    prisma.promoCode.findUnique({ where: { code: code.toUpperCase() } })
  )

  // Unified 400 for all invalid states — prevents timing oracle
  if (!promo || !promo.active) {
    return NextResponse.json({ error: INVALID_MSG }, { status: 400 })
  }
  if (promo.expiresAt && promo.expiresAt < new Date()) {
    return NextResponse.json({ error: INVALID_MSG }, { status: 400 })
  }
  if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
    return NextResponse.json({ error: INVALID_MSG }, { status: 400 })
  }

  const discount = Math.round((subtotal ?? 0) * promo.percent / 100)
  return NextResponse.json({ code: promo.code, percent: promo.percent, discount })
}
