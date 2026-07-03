import { NextRequest, NextResponse } from 'next/server'
import { prisma, dbRetry } from '@/lib/prisma'

// Public endpoint — returns only non-sensitive order data
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const order = await dbRetry(() => prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      number: true,
      status: true,
      deliveryType: true,
      paymentMethod: true,
      invoiceNumber: true,
      subtotal: true,
      discount: true,
      promoDiscount: true,
      deliveryFee: true,
      total: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          productName: true,
          quantity: true,
          unitPrice: true,
        },
      },
    },
  }))

  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(order)
}
