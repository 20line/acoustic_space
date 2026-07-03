import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma, dbRetry } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

export async function POST(req: NextRequest) {
  if (!rateLimit(getClientIp(req), 3, 60_000)) {
    return NextResponse.json({ error: 'Слишком много попыток. Подождите минуту.' }, { status: 429 })
  }
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { name, email, password } = parsed.data

    const existing = await dbRetry(() => prisma.user.findUnique({ where: { email } }))
    if (existing) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 },
      )
    }

    const passwordHash = await hashPassword(password)

    await dbRetry(() => prisma.user.create({
      data: { name, email, passwordHash },
    }))

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/auth/register]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
