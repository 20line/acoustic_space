'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ORDER_STATUS_LABELS } from '@/types/cart'

const STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS) as [string, string][]

interface Order {
  id: string
  number: string
  customerName: string
  customerPhone: string
  customerEmail: string | null
  status: string
  paymentStatus: string
  total: number
  createdAt: string
  items: Array<{ productName: string; quantity: number }>
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const qs = new URLSearchParams({ page: String(page) })
    if (statusFilter) qs.set('status', statusFilter)
    const res = await fetch(`/api/admin/orders?${qs}`)
    if (res.status === 403) { router.replace('/login'); return }
    const data = await res.json()
    setOrders(data.orders)
    setTotal(data.total)
    setPages(data.pages)
    setLoading(false)
  }

  useEffect(() => { load() }, [page, statusFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  async function changeStatus(orderId: string, status: string) {
    setUpdating(orderId)
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setUpdating(null)
    load()
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB] py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-[#2C2C2C]">Заказы · {total}</h1>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Все статусы</option>
            {STATUS_OPTIONS.map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i) => <div key={i} className="h-24 rounded-xl bg-white animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-center py-20">Заказов нет</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex flex-wrap items-start gap-4 justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-[#2C2C2C]">№ {order.number}</span>
                      <PayBadge status={order.paymentStatus} />
                    </div>
                    <p className="text-sm text-gray-600">{order.customerName} · {order.customerPhone}</p>
                    {order.customerEmail && <p className="text-sm text-gray-400">{order.customerEmail}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleString('ru-RU')}
                    </p>
                    <p className="text-sm mt-2 text-gray-500">
                      {order.items.map((i) => `${i.productName} ×${i.quantity}`).join(', ')}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="font-semibold text-[#8B7355]">
                      {(order.total / 100).toLocaleString('ru-RU')} ₽
                    </span>
                    <select
                      value={order.status}
                      disabled={updating === order.id}
                      onChange={(e) => changeStatus(order.id, e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  p === page ? 'bg-[#8B7355] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PayBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    PAID: ['bg-green-100 text-green-700', 'Оплачен'],
    PENDING: ['bg-yellow-100 text-yellow-700', 'Ожидание'],
    FAILED: ['bg-red-100 text-red-700', 'Ошибка'],
    REFUNDED: ['bg-gray-100 text-gray-600', 'Возврат'],
  }
  const [cls, label] = map[status] ?? ['bg-gray-100 text-gray-500', status]
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}>{label}</span>
}
