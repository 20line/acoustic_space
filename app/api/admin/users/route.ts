import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, dbRetry } from '@/lib/prisma'
import { adminGuard } from '@/lib/admin-guard'

const VALID_ROLES = ['CUSTOMER', 'DESIGNER', 'ARCHITECT', 'DEALER', 'ADMIN'] as const

// GET /api/admin/users?page=1&q=search
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const denied = adminGuard(session)
  if (denied) return denied

  const page = Math.max(1, Number(req.nextUrl.searchParams.get('page') ?? 1))
  const q = req.nextUrl.searchParams.get('q') ?? ''
  const take = 30

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' as const } },
          { email: { contains: q, mode: 'insensitive' as const } },
          { phone: { contains: q } },
        ],
      }
    : {}

  const [users, total] = await Promise.all([
    dbRetry(() => prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * take,
      take,
    })),
    dbRetry(() => prisma.user.count({ where })),
  ])

  return NextResponse.json({ users, total, page, pages: Math.ceil(total / take) })
}

// PATCH /api/admin/users  { id, role }
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const denied = adminGuard(session)
  if (denied) return denied

  const { id, role } = await req.json()
  if (!id || !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: 'id and valid role required' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await dbRetry(() => prisma.user.update({ where: { id }, data: { role: role as any } }))
  return NextResponse.json({ id: user.id, role: user.role })
}
