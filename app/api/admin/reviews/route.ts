import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, dbRetry } from '@/lib/prisma'
import { adminGuard } from '@/lib/admin-guard'

// GET /api/admin/reviews?approved=false&page=1
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const denied = adminGuard(session)
  if (denied) return denied

  const approvedParam = req.nextUrl.searchParams.get('approved')
  const page = Math.max(1, Number(req.nextUrl.searchParams.get('page') ?? 1))
  const take = 30

  const where =
    approvedParam === null ? {} : { approved: approvedParam !== 'false' }

  const [reviews, total] = await Promise.all([
    dbRetry(() => prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * take,
      take,
      include: { user: { select: { name: true, email: true } } },
    })),
    dbRetry(() => prisma.review.count({ where })),
  ])

  return NextResponse.json({ reviews, total, page, pages: Math.ceil(total / take) })
}

// PATCH /api/admin/reviews  { id, approved }
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const denied = adminGuard(session)
  if (denied) return denied

  const { id, approved } = await req.json()
  if (!id || typeof approved !== 'boolean') {
    return NextResponse.json({ error: 'id and approved required' }, { status: 400 })
  }

  const review = await dbRetry(() => prisma.review.update({ where: { id }, data: { approved } }))
  return NextResponse.json(review)
}

// DELETE /api/admin/reviews  { id }
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const denied = adminGuard(session)
  if (denied) return denied

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  await dbRetry(() => prisma.review.delete({ where: { id } }))
  return NextResponse.json({ ok: true })
}
