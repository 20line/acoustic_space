import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma, dbRetry } from '@/lib/prisma'
import { sendSms, generateOtp } from '@/lib/smsc'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const schema = z.object({
  phone: z.string().min(10).max(20),
})

export async function POST(req: NextRequest) {
  if (!rateLimit(getClientIp(req), 3, 300_000)) {
    return NextResponse.json({ error: 'Превышен лимит SMS. Попробуйте через 5 минут.' }, { status: 429 })
  }
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Неверный формат телефона' }, { status: 400 })
    }

    const phone = parsed.data.phone.replace(/\D/g, '')
    const normalizedPhone = phone.startsWith('8') ? `7${phone.slice(1)}` : phone

    // Rate limit: max 3 codes per phone per 10 minutes
    const recentCount = await dbRetry(() =>
      prisma.smsCode.count({
        where: {
          phone: normalizedPhone,
          createdAt: { gt: new Date(Date.now() - 10 * 60 * 1000) },
        },
      })
    )

    if (recentCount >= 3) {
      return NextResponse.json(
        { error: 'Слишком много попыток. Подождите 10 минут.' },
        { status: 429 },
      )
    }

    const code = generateOtp()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 min

    await dbRetry(() =>
      prisma.smsCode.create({
        data: { phone: normalizedPhone, code, expiresAt },
      })
    )

    await sendSms(normalizedPhone, `Ваш код ACOUSTIC SPACE: ${code}. Действителен 5 минут.`)

    return NextResponse.json({ success: true, phone: normalizedPhone })
  } catch (err) {
    console.error('[POST /api/auth/sms/send]', err)
    return NextResponse.json({ error: 'Не удалось отправить SMS' }, { status: 500 })
  }
}
