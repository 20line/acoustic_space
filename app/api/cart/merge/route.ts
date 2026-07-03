import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { mergeGuestCart, cartTotal, cartCount } from '@/lib/cart-session'

const schema = z.object({
  guestCartId: z.string().min(1),
})

// POST /api/cart/merge — called right after user logs in
// Merges guest cart into the authenticated user's cart.
// userId is taken from the JWT session — never from the request body.
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { guestCartId } = parsed.data
    const merged = await mergeGuestCart(guestCartId, session.user.id)

    const res = NextResponse.json({
      id: merged.id,
      items: merged.items,
      total: cartTotal(merged.items),
      count: cartCount(merged.items),
    })

    res.headers.set(
      'Set-Cookie',
      '_akusto_gc=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
    )

    return res
  } catch (err) {
    console.error('[POST /api/cart/merge]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
