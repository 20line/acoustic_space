import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, dbRetry } from '@/lib/prisma'
import { getOrCreateCart, cartTotal, cartCount } from '@/lib/cart-session'

const patchSchema = z.object({
  quantity: z.number().int().min(1).max(100),
})

// PATCH /api/cart/items/[itemId] — update quantity
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const { itemId } = await params
    const body = await req.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? undefined
    const cart = await getOrCreateCart(userId)

    const item = cart.items.find((i) => i.id === itemId)
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    await dbRetry(() => prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: parsed.data.quantity },
    }))

    const updated = await dbRetry(() => prisma.cart.findUniqueOrThrow({
      where: { id: cart.id },
      include: { items: true },
    }))

    return NextResponse.json({
      id: updated.id,
      items: updated.items,
      total: cartTotal(updated.items),
      count: cartCount(updated.items),
    })
  } catch (err) {
    console.error('[PATCH /api/cart/items]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/cart/items/[itemId] — remove item
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const { itemId } = await params
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? undefined
    const cart = await getOrCreateCart(userId)

    const item = cart.items.find((i) => i.id === itemId)
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    await dbRetry(() => prisma.cartItem.delete({ where: { id: itemId } }))

    const updated = await dbRetry(() => prisma.cart.findUniqueOrThrow({
      where: { id: cart.id },
      include: { items: true },
    }))

    return NextResponse.json({
      id: updated.id,
      items: updated.items,
      total: cartTotal(updated.items),
      count: cartCount(updated.items),
    })
  } catch (err) {
    console.error('[DELETE /api/cart/items]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
