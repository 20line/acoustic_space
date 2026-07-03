import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma, dbRetry } from '@/lib/prisma'
import { OrderCard } from '@/components/account/OrderCard'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import type { Order } from '@/types/cart'

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const orders = await dbRetry(() => prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-[32px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
        Мои заказы
      </h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[12px] py-16 text-center" style={{ background: 'var(--cream-2)' }}>
          <ShoppingBag size={44} strokeWidth={1} style={{ color: 'var(--muted)' }} />
          <p className="text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Заказов пока нет
          </p>
          <p className="text-[14px]" style={{ color: 'var(--muted)' }}>
            Выберите панели в каталоге и оформите первый заказ
          </p>
          <Link href="/catalog" className="btn btn-dark mt-2 text-[13px]">
            В каталог
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order as unknown as Order} />
          ))}
        </div>
      )}
    </div>
  )
}
