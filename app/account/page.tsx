import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { OrderCard } from '@/components/account/OrderCard'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, User } from 'lucide-react'
import type { Order } from '@/types/cart'

export default async function AccountPage() {
  const session = await getServerSession(authOptions)
  const userId = session!.user.id

  const [orders, user] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.user.findUnique({ where: { id: userId } }),
  ])

  const totalSpent = orders.reduce((s, o) => s + o.total, 0)
  const activeOrders = orders.filter((o) => !['DONE', 'CANCELLED'].includes(o.status))

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-[32px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
          Добро пожаловать{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="mt-1 text-[14px]" style={{ color: 'var(--muted)' }}>
          {user?.email ?? user?.phone ?? ''}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: 'Всего заказов', value: orders.length },
          { label: 'Активных', value: activeOrders.length },
          {
            label: 'Потрачено',
            value: (totalSpent / 100).toLocaleString('ru-RU') + ' ₽',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-[10px] p-4"
            style={{ background: 'var(--cream-2)' }}
          >
            <p className="text-[24px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
              {s.value}
            </p>
            <p className="text-[12px]" style={{ color: 'var(--muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Последние заказы
          </h2>
          {orders.length > 0 && (
            <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: 'var(--accent)' }}>
              Все заказы <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-[12px] py-14 text-center" style={{ background: 'var(--cream-2)' }}>
            <ShoppingBag size={40} strokeWidth={1} style={{ color: 'var(--muted)' }} />
            <p className="text-[18px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Заказов пока нет
            </p>
            <Link href="/catalog" className="btn btn-dark text-[13px]">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order as unknown as Order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
