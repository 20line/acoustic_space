import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma, dbRetry } from '@/lib/prisma'
import { hashPassword, verifyPassword } from '@/lib/password'

const schema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional().or(z.literal('')),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await dbRetry(() => prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
  }))
  return NextResponse.json(user)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { name, email, currentPassword, newPassword } = parsed.data
  const updates: Record<string, unknown> = {}

  if (name !== undefined) updates.name = name
  if (email !== undefined) updates.email = email || null

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: 'Введите текущий пароль' }, { status: 400 })
    }
    const user = await dbRetry(() => prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    }))
    if (!user?.passwordHash || !(await verifyPassword(currentPassword, user.passwordHash))) {
      return NextResponse.json({ error: 'Неверный текущий пароль' }, { status: 400 })
    }
    updates.passwordHash = await hashPassword(newPassword)
  }

  const updated = await dbRetry(() => prisma.user.update({
    where: { id: session.user.id },
    data: updates,
    select: { id: true, name: true, email: true, phone: true },
  }))

  return NextResponse.json(updated)
}
