import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, dbRetry } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'
import { sendMail, orderStatusHtml } from '@/lib/mailer'
import { ORDER_STATUS_LABELS } from '@/types/cart'
import { adminGuard } from '@/lib/admin-guard'

const patchSchema = z.object({ status: z.nativeEnum(OrderStatus) })

// PATCH /api/admin/orders/[id]  { status }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  const denied = adminGuard(session)
  if (denied) return denied

  const { id } = await params
  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { status } = parsed.data

  const order = await dbRetry(() => prisma.order.update({
    where: { id },
    data: { status },
    include: { items: true },
  }))

  // Email customer on status change
  if (order.customerEmail) {
    const label = ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] ?? status
    await sendMail({
      to: order.customerEmail,
      subject: `Статус заказа ${order.number} изменён — Acoustic Space`,
      html: orderStatusHtml({ orderNumber: order.number, customerName: order.customerName, status: label }),
    }).catch(() => {})
  }

  return NextResponse.json(order)
}
