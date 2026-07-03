import { cookies } from 'next/headers'
import { prisma } from './prisma'
import type { Cart, CartItem } from '@prisma/client'

export const GUEST_COOKIE = '_akusto_gc'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30

export type CartWithItems = Cart & {
  items: CartItem[]
}

// ─── Resolve or create cart for the current request ───────────────────────────

export async function getOrCreateCart(userId?: string): Promise<CartWithItems> {
  const cookieStore = await cookies()

  if (userId) {
    const existing = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    })
    if (existing) return existing
    return prisma.cart.create({ data: { userId }, include: { items: true } })
  }

  const guestId = cookieStore.get(GUEST_COOKIE)?.value
  if (guestId) {
    const existing = await prisma.cart.findUnique({
      where: { id: guestId },
      include: { items: true },
    })
    if (existing && existing.userId === null) return existing
  }

  return prisma.cart.create({ data: {}, include: { items: true } })
}

export function buildGuestCookie(cartId: string) {
  // No HttpOnly — JS must read this cookie to merge the guest cart on login.
  // Cart IDs are non-sensitive UUIDs; protected from XSS by CSP.
  return `${GUEST_COOKIE}=${cartId}; Path=/; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`
}

// ─── Merge guest cart into user cart on login ─────────────────────────────────

export async function mergeGuestCart(guestCartId: string, userId: string): Promise<CartWithItems> {
  const [guestCart, existingUserCart] = await Promise.all([
    prisma.cart.findUnique({ where: { id: guestCartId }, include: { items: true } }),
    prisma.cart.findUnique({ where: { userId }, include: { items: true } }),
  ])

  const userCart = existingUserCart ?? await prisma.cart.create({
    data: { userId },
    include: { items: true },
  })

  if (!guestCart || guestCart.items.length === 0) return userCart

  for (const guestItem of guestCart.items) {
    const existing = userCart.items.find((i) => i.productId === guestItem.productId)
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + guestItem.quantity },
      })
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: guestItem.productId,
          productName: guestItem.productName,
          unitPrice: guestItem.unitPrice,
          quantity: guestItem.quantity,
          config: guestItem.config ?? undefined,
        },
      })
    }
  }

  await prisma.cart.delete({ where: { id: guestCartId } })

  return prisma.cart.findUniqueOrThrow({
    where: { id: userCart.id },
    include: { items: true },
  })
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0)
}
