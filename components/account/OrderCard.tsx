import Link from 'next/link'
import { ArrowRight, Package, FileDown } from 'lucide-react'
import { OrderStatusTracker } from './OrderStatusTracker'
import type { Order } from '@/types/cart'
import { ORDER_STATUS_LABELS } from '@/types/cart'

function formatPrice(kopecks: number) {
  return (kopecks / 100).toLocaleString('ru-RU', {
    style: 'currency', currency: 'RUB', maximumFractionDigits: 0,
  })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function OrderCard({ order }: { order: Order }) {
  return (
    <article
      className="rounded-[12px] border p-6 space-y-5 transition-shadow hover:shadow-md"
      style={{ borderColor: 'var(--line)', background: 'var(--cream)' }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[18px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Заказ {order.number}
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{
                background: order.status === 'DONE' ? '#dcfce7' : order.status === 'CANCELLED' ? '#fee2e2' : 'var(--sand)',
                color: order.status === 'DONE' ? '#166534' : order.status === 'CANCELLED' ? '#991b1b' : 'var(--ink)',
              }}
            >
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>
          <p className="mt-0.5 text-[13px]" style={{ color: 'var(--muted)' }}>
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
            {formatPrice(order.total)}
          </p>
          <p className="text-[12px]" style={{ color: 'var(--muted)' }}>
            {order.items.length} {order.items.length === 1 ? 'позиция' : order.items.length < 5 ? 'позиции' : 'позиций'}
          </p>
        </div>
      </div>

      {/* Status tracker */}
      <OrderStatusTracker status={order.status} />

      {/* Items preview */}
      <div className="space-y-2 border-t pt-4" style={{ borderColor: 'var(--line)' }}>
        {order.items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex justify-between text-[13px]">
            <span className="truncate mr-4" style={{ color: 'var(--ink)' }}>
              {item.productName} × {item.quantity}
            </span>
            <span className="flex-shrink-0 font-medium">
              {formatPrice(item.unitPrice * item.quantity)}
            </span>
          </div>
        ))}
        {order.items.length > 3 && (
          <p className="text-[12px]" style={{ color: 'var(--muted)' }}>
            +ещё {order.items.length - 3} позиц.
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--muted)' }}>
            <Package size={13} />
            {order.deliveryType === 'PICKUP' ? 'Самовывоз' : order.deliveryType === 'COURIER' ? 'Курьер' : 'Транспортная'}
          </div>
          {order.invoiceNumber && (
            <a
              href={`/api/orders/${order.id}/invoice`}
              download
              className="inline-flex items-center gap-1 text-[12px] transition-opacity hover:opacity-70"
              style={{ color: 'var(--muted)' }}
              title="Скачать счёт"
            >
              <FileDown size={13} />
              Счёт
            </a>
          )}
        </div>
        <Link
          href={`/account/orders/${order.id}`}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-opacity hover:opacity-70"
          style={{ color: 'var(--accent)' }}
        >
          Подробнее
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  )
}
