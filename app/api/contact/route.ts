import { NextRequest, NextResponse } from 'next/server'
import { sendTelegramNotification } from '@/lib/telegram'
import { z } from 'zod'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

const schema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(7).max(30),
  email: z.string().email().optional().or(z.literal('')),
  telegram: z.string().optional(),
  roomType: z.string().optional(),
  comment: z.string().max(2000).optional(),
  // 152-ФЗ: explicit personal-data processing consent is mandatory
  consent: z
    .union([z.literal('true'), z.literal('on'), z.literal(true)])
    .transform(() => true),
})

export async function POST(req: NextRequest) {
  if (!rateLimit(getClientIp(req), 5, 60_000)) {
    return NextResponse.json({ error: 'Слишком много запросов. Попробуйте через минуту.' }, { status: 429 })
  }
  try {
    const contentType = req.headers.get('content-type') ?? ''
    let raw: Record<string, string> = {}

    if (contentType.includes('multipart/form-data')) {
      const fd = await req.formData()
      fd.forEach((v, k) => {
        if (typeof v === 'string') raw[k] = v
      })
    } else if (contentType.includes('application/json')) {
      raw = await req.json()
    } else {
      const text = await req.text()
      const params = new URLSearchParams(text)
      params.forEach((v, k) => { raw[k] = v })
    }

    const data = schema.safeParse(raw)
    if (!data.success) {
      return NextResponse.json({ error: 'Validation failed', details: data.error.flatten() }, { status: 400 })
    }

    const { name, phone, email = '', telegram = '', roomType = '', comment = '' } = data.data

    await sendTelegramNotification({ name, phone, email, telegram, roomType, comment })

    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? 'noreply@akusto.ru',
          to: [process.env.RESEND_TO_EMAIL ?? 'hello@akusto.ru'],
          subject: `Новая заявка от ${name}`,
          html: `
            <h2>Новая заявка с сайта ACOUSTIC SPACE</h2>
            <p><strong>Имя:</strong> ${esc(name)}</p>
            <p><strong>Телефон:</strong> ${esc(phone)}</p>
            <p><strong>Email:</strong> ${esc(email || '—')}</p>
            <p><strong>Telegram:</strong> ${esc(telegram || '—')}</p>
            <p><strong>Тип помещения:</strong> ${esc(roomType || '—')}</p>
            <p><strong>Комментарий:</strong> ${esc(comment || '—')}</p>
          `,
        })
      } catch {
        // Email sending failed, but Telegram already sent
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
