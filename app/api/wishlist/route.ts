import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, dbRetry } from '@/lib/prisma'
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await dbRetry(() => prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  }))
  return NextResponse.json(items.map((i: { productId: string }) => i.productId))
}

// POST { productId } — toggle
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { productId } = await req.json()
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })

  const existing = await dbRetry(() => prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  }))

  if (existing) {
    await dbRetry(() => prisma.wishlistItem.delete({ where: { id: existing.id } }))
    return NextResponse.json({ wishlisted: false })
  } else {
    await dbRetry(() => prisma.wishlistItem.create({
      data: { userId: session.user.id, productId },
    }))
    return NextResponse.json({ wishlisted: true })
  }
}
