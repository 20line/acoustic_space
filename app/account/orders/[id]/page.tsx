import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma, dbRetry } from '@/lib/prisma'
import { OrderStatusTracker } from '@/components/account/OrderStatusTracker'
import { ArrowLeft, MapPin, MessageSquare, Package } from 'lucide-react'
import type { OrderStatus } from '@/types/cart'
import { ORDER_STATUS_LABELS } from '@/types/cart'

function formatPrice(k: number) {
  return (k / 100).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'ADMIN'

  const order = await dbRetry(() => prisma.order.findUnique({
    where: { id },
    include: { items: true },
  }))

  if (!order) notFound()
  // Guest orders: only admins allowed (prevents any logged-in user from reading any guest order)
  if (!order.userId && !isAdmin) notFound()
  // User orders: own orders only
  if (order.userId && order.userId !== session?.user.id && !isAdmin) notFound()

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-[13px]" style={{ color: 'var(--muted)' }}>
        <ArrowLeft size={14} /> Все заказы
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Заказ {order.number}
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--muted)' }}>
            Создан {formatDate(order.createdAt.toISOString())}
          </p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-[12px] font-semibold"
          style={{
            background: order.status === 'DONE' ? '#dcfce7' : order.status === 'CANCELLED' ? '#fee2e2' : 'var(--sand)',
            color: order.status === 'DONE' ? '#166534' : order.status === 'CANCELLED' ? '#991b1b' : 'var(--ink)',
          }}
        >
          {ORDER_STATUS_LABELS[order.status as OrderStatus]}
        </span>
      </div>

      {/* Status tracker */}
      <div className="rounded-[12px] border p-6" style={{ borderColor: 'var(--line)' }}>
        <h2 className="mb-5 text-[16px] font-semibold">Этапы производства</h2>
        <OrderStatusTracker status={order.status as OrderStatus} />
      </div>

      {/* Items */}
      <div className="rounded-[12px] border" style={{ borderColor: 'var(--line)' }}>
        <div className="border-b px-6 py-4" style={{ borderColor: 'var(--line)' }}>
          <h2 className="text-[16px] font-semibold">Состав заказа</h2>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--line)' }}>
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[6px] flex-shrink-0" style={{ background: 'var(--sand)' }}>
                  <Package size={16} style={{ color: 'var(--muted)' }} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold">{item.productName}</p>
                  <p className="text-[12px]" style={{ color: 'var(--muted)' }}>
                    {formatPrice(item.unitPrice)} × {item.quantity} шт.
                  </p>
                </div>
              </div>
              <p className="text-[15px] font-semibold flex-shrink-0">
                {formatPrice(item.unitPrice * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t px-6 py-4 space-y-2" style={{ borderColor: 'var(--line)' }}>
          <div className="flex justify-between text-[13px]" style={{ color: 'var(--muted)' }}>
            <span>Товары</span><span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.promoDiscount > 0 && (
            <div className="flex justify-between text-[13px] text-green-600">
              <span>Промокод {order.promoCode}</span><span>−{formatPrice(order.promoDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between text-[13px]" style={{ color: 'var(--muted)' }}>
            <span>Доставка</span>
            <span>{order.deliveryFee > 0 ? formatPrice(order.deliveryFee) : 'Бесплатно'}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-[16px] font-semibold" style={{ borderColor: 'var(--line)' }}>
            <span>Итого</span><span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[12px] border p-5" style={{ borderColor: 'var(--line)' }}>
          <h3 className="mb-3 text-[14px] font-semibold">Контакты</h3>
          <p className="text-[14px]">{order.customerName}</p>
          <p className="text-[13px]" style={{ color: 'var(--muted)' }}>{order.customerPhone}</p>
          {order.customerEmail && <p className="text-[13px]" style={{ color: 'var(--muted)' }}>{order.customerEmail}</p>}
        </div>

        <div className="rounded-[12px] border p-5" style={{ borderColor: 'var(--line)' }}>
          <h3 className="mb-3 flex items-center gap-1.5 text-[14px] font-semibold">
            <MapPin size={14} />
            Доставка
          </h3>
          <p className="text-[14px]">
            {order.deliveryType === 'PICKUP' ? 'Самовывоз' : order.deliveryType === 'COURIER' ? 'Курьером' : 'Транспортной компанией'}
          </p>
          {order.deliveryAddress && (
            <p className="mt-1 text-[13px]" style={{ color: 'var(--muted)' }}>{order.deliveryAddress}</p>
          )}
        </div>

        {order.comment && (
          <div className="rounded-[12px] border p-5 sm:col-span-2" style={{ borderColor: 'var(--line)' }}>
            <h3 className="mb-2 flex items-center gap-1.5 text-[14px] font-semibold">
              <MessageSquare size={14} />
              Комментарий
            </h3>
            <p className="text-[14px]" style={{ color: 'var(--muted)' }}>{order.comment}</p>
          </div>
        )}
      </div>
    </div>
  )
}
