import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, dbRetry } from '@/lib/prisma'
import { adminGuard } from '@/lib/admin-guard'

// GET /api/admin/orders?status=NEW&page=1
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const denied = adminGuard(session)
  if (denied) return denied

  const status = req.nextUrl.searchParams.get('status') || undefined
  const page = Math.max(1, Number(req.nextUrl.searchParams.get('page') ?? 1))
  const take = 20

  const [orders, total] = await Promise.all([
    dbRetry(() => prisma.order.findMany({
      where: status ? { status: status as never } : undefined,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * take,
      take,
    })),
    dbRetry(() => prisma.order.count({ where: status ? { status: status as never } : undefined })),
  ])

  return NextResponse.json({ orders, total, page, pages: Math.ceil(total / take) })
}
