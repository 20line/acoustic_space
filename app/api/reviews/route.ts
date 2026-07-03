import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma, dbRetry } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1).max(100),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(10).max(2000),
})

// GET /api/reviews?productId=xxx
export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })

  const reviews = await dbRetry(() => prisma.review.findMany({
    where: { productId, approved: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, rating: true, text: true, createdAt: true },
  }))
  return NextResponse.json(reviews)
}

// POST /api/reviews
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(ip, 3, 60_000)) {
    return NextResponse.json({ error: 'Слишком много запросов. Попробуйте позже.' }, { status: 429 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const session = await getServerSession(authOptions)
  const { productId, name, rating, text } = parsed.data

  const review = await dbRetry(() => prisma.review.create({
    data: {
      productId,
      userId: session?.user.id ?? null,
      name,
      rating,
      text,
      approved: false,
    },
  }))

  return NextResponse.json({ id: review.id, message: 'Отзыв отправлен на модерацию' }, { status: 201 })
}
