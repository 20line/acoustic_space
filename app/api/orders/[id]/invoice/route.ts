import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, dbRetry } from '@/lib/prisma'
import { renderToBuffer } from '@react-pdf/renderer'
import type { DocumentProps } from '@react-pdf/renderer'
import { createElement, type ReactElement } from 'react'
import { InvoicePDF } from '@/components/pdf/InvoicePDF'

// GET /api/orders/[id]/invoice — generate and download PDF invoice
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const order = await dbRetry(() =>
    prisma.order.findUnique({
      where: { id },
      include: { items: true },
    })
  )

  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isAdmin = (session.user as { role?: string }).role === 'ADMIN'
  if (order.userId && order.userId !== session.user.id && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!order.invoiceNumber) {
    return NextResponse.json({ error: 'Счёт для этого заказа недоступен' }, { status: 404 })
  }

  const seller = {
    name: process.env.SELLER_NAME ?? 'ACOUSTIC SPACE',
    inn: process.env.SELLER_INN ?? '',
    kpp: process.env.SELLER_KPP ?? '',
    address: process.env.SELLER_ADDRESS ?? '',
    bank: process.env.SELLER_BANK ?? '',
    bik: process.env.SELLER_BIK ?? '',
    account: process.env.SELLER_ACCOUNT ?? '',
    corrAccount: process.env.SELLER_CORR_ACCOUNT ?? '',
  }

  const element = createElement(InvoicePDF, {
    data: {
      invoiceNumber: order.invoiceNumber,
      orderNumber: order.number,
      date: order.createdAt.toISOString(),
      seller,
      buyer: {
        name: order.legalName ?? order.customerName,
        inn: order.legalInn ?? '',
        kpp: order.legalKpp ?? undefined,
        address: order.legalAddress ?? order.deliveryAddress ?? '',
      },
      items: order.items.map((item) => ({
        name: item.productName,
        qty: item.quantity,
        unit: 'шт.',
        price: item.unitPrice,
      })),
      vatRate: null,
    },
  }) as unknown as ReactElement<DocumentProps>

  const buffer = await renderToBuffer(element)
  const ab = new ArrayBuffer(buffer.byteLength)
  new Uint8Array(ab).set(buffer)

  return new Response(ab, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${order.invoiceNumber}.pdf"`,
      'Content-Length': String(buffer.byteLength),
    },
  })
}
