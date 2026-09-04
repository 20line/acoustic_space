import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, dbRetry } from '@/lib/prisma'
import { getOrCreateCart } from '@/lib/cart-session'
import { rateLimit } from '@/lib/rate-limit'
import { generateOrderNumber } from '@/lib/order-number'
import { generateInvoiceNumber } from '@/lib/invoice-number'
import { sendOrderTelegram } from '@/lib/telegram'
import { calcDeliveryFee } from '@/lib/delivery'
import { sendMail, orderConfirmHtml } from '@/lib/mailer'
import { SITE_URL } from '@/lib/utils'

const createOrderSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().min(7).max(30),
  customerEmail: z.string().email().optional().or(z.literal('')),
  deliveryType: z.enum(['PICKUP', 'COURIER', 'TRANSPORT']).default('PICKUP'),
  deliveryAddress: z.string().max(500).optional(),
  promoCode: z.string().max(50).optional(),
  comment: z.string().max(2000).optional(),
  paymentMethod: z.enum(['CARD', 'SBP', 'INVOICE']).default('CARD'),
  // Legal entity fields (required when paymentMethod === 'INVOICE')
  legalName: z.string().max(300).optional(),
  legalInn: z.string().max(12).optional(),
  legalKpp: z.string().max(9).optional(),
  legalAddress: z.string().max(500).optional(),
  // 152-ФЗ: explicit personal-data processing consent is mandatory
  consent: z.literal(true, { message: 'Необходимо согласие на обработку персональных данных' }),
})

// GET /api/orders — list orders for authenticated user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await dbRetry(() =>
      prisma.order.findMany({
        where: { userId },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      })
    )

    return NextResponse.json(orders)
  } catch (err) {
    console.error('[GET /api/orders]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/orders — create order from current cart
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(ip, 5, 5 * 60_000)) {
    return NextResponse.json({ error: 'Слишком много запросов. Попробуйте позже.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const parsed = createOrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? undefined
    const cart = await dbRetry(() => getOrCreateCart(userId))

    if (cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryType,
      deliveryAddress,
      promoCode,
      comment,
      paymentMethod,
      legalName,
      legalInn,
      legalKpp,
      legalAddress,
    } = parsed.data

    const subtotal = cart.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
    const deliveryFee = calcDeliveryFee(deliveryType)

    // Validate promo code
    let promoDiscount = 0
    let validatedPromoCode: string | null = promoCode || null
    if (promoCode) {
      const promo = await dbRetry(() => prisma.promoCode.findUnique({ where: { code: promoCode.toUpperCase() } }))
      if (
        promo &&
        promo.active &&
        (!promo.expiresAt || promo.expiresAt > new Date()) &&
        (promo.maxUses === null || promo.usedCount < promo.maxUses)
      ) {
        promoDiscount = Math.round((subtotal * promo.percent) / 100)
      } else {
        validatedPromoCode = null
      }
    }

    const total = subtotal + deliveryFee - promoDiscount

    const number = await generateOrderNumber()
    const invoiceNumber = paymentMethod === 'INVOICE' ? await generateInvoiceNumber() : null

    const order = await dbRetry(() => prisma.order.create({
      data: {
        number,
        invoiceNumber,
        userId: userId ?? null,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        deliveryType,
        deliveryAddress: deliveryAddress || null,
        promoCode: validatedPromoCode,
        promoDiscount,
        comment: comment || null,
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        legalName: legalName || null,
        legalInn: legalInn || null,
        legalKpp: legalKpp || null,
        legalAddress: legalAddress || null,
        items: {
          create: cart.items.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            config: i.config ?? undefined,
          })),
        },
      },
      include: { items: true },
    }))

    // Clear the cart after order is placed
    await dbRetry(() => prisma.cartItem.deleteMany({ where: { cartId: cart.id } }))

    // Increment promo usedCount
    if (validatedPromoCode) {
      await prisma.promoCode.update({
        where: { code: validatedPromoCode },
        data: { usedCount: { increment: 1 } },
      }).catch(() => {})
    }

    const adminUrl = `${SITE_URL}/admin/orders?order=${number}`

    // Telegram + Email notifications in parallel
    const [tgResult] = await Promise.allSettled([
      sendOrderTelegram({
        orderNumber: number,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        items: order.items,
        subtotal,
        deliveryFee,
        promoDiscount,
        total,
        deliveryType,
        deliveryAddress: deliveryAddress || null,
        paymentMethod,
        promoCode: validatedPromoCode,
        comment: comment || null,
        invoiceNumber,
        legal: {
          name: legalName || null,
          inn: legalInn || null,
          kpp: legalKpp || null,
          address: legalAddress || null,
        },
        adminUrl,
      }),
      customerEmail
        ? sendMail({
            to: customerEmail,
            subject: `Ваш заказ ${number} — Acoustic Space`,
            html: orderConfirmHtml({
              orderNumber: number,
              customerName,
              items: order.items,
              total,
            }),
          })
        : Promise.resolve(),
    ])

    if (tgResult.status === 'rejected' || !tgResult.value) {
      console.error('[POST /api/orders] Telegram notification failed for order', number, tgResult)
    }

    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    console.error('[POST /api/orders]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
