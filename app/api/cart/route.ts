import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOrCreateCart, buildGuestCookie, cartTotal, cartCount } from '@/lib/cart-session'
import { prisma, dbRetry } from '@/lib/prisma'

const addItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),
  unitPrice: z.number().int().positive(),
  quantity: z.number().int().min(1).max(100).default(1),
  config: z.record(z.unknown()).optional(),
})

// GET /api/cart — return current cart
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? undefined
    const cart = await dbRetry(() => getOrCreateCart(userId))

    const res = NextResponse.json({
      id: cart.id,
      items: cart.items,
      total: cartTotal(cart.items),
      count: cartCount(cart.items),
    })

    if (!userId && !req.cookies.get('_akusto_gc')) {
      res.headers.set('Set-Cookie', buildGuestCookie(cart.id))
    }

    return res
  } catch (err) {
    console.error('[GET /api/cart]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/cart — add item to cart
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = addItemSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { productId, productName, unitPrice, quantity, config } = parsed.data
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? undefined
    const cart = await dbRetry(() => getOrCreateCart(userId))

    const existing = cart.items.find((i) => i.productId === productId)

    await dbRetry(async () => {
      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + quantity },
        })
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            productName,
            unitPrice,
            quantity,
            config: config ? JSON.parse(JSON.stringify(config)) : undefined,
          },
        })
      }
    })

    const updated = await dbRetry(() => prisma.cart.findUniqueOrThrow({
      where: { id: cart.id },
      include: { items: true },
    }))

    const res = NextResponse.json({
      id: updated.id,
      items: updated.items,
      total: cartTotal(updated.items),
      count: cartCount(updated.items),
    })

    if (!userId && !req.cookies.get('_akusto_gc')) {
      res.headers.set('Set-Cookie', buildGuestCookie(cart.id))
    }

    return res
  } catch (err) {
    console.error('[POST /api/cart]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
