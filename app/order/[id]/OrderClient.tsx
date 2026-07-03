'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ORDER_STATUS_LABELS, ORDER_STATUS_STEP } from '@/types/cart'

interface OrderItem {
  id: string
  productName: string
  quantity: number
  unitPrice: number
}

interface OrderData {
  id: string
  number: string
  status: string
  paymentStatus: string
  deliveryType: string
  subtotal: number
  discount: number
  promoDiscount: number
  deliveryFee: number
  total: number
  createdAt: string
  paymentMethod: string
  invoiceNumber: string | null
  items: OrderItem[]
}

const STEPS = [
  'Новый',
  'Проектирование',
  'Согласование',
  'Производство',
  'Покраска',
  'Упаковка',
  'Отгрузка',
  'Монтаж',
  'Завершён',
]

const fmt = (k: number) =>
  (k / 100).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })

export default function OrderClient() {
  const params = useParams<{ id: string }>()
  const [order, setOrder] = useState<OrderData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const id = params.id
    if (!id) return
    fetch(`/api/order/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(setOrder)
      .catch(() => setError(true))
  }, [params.id])

  const currentStep = order
    ? ORDER_STATUS_STEP[order.status as keyof typeof ORDER_STATUS_STEP] ?? 0
    : 0

  return (
    <>
      <ProgressBar />
      <Header />
      <main className="pt-24 pb-20 min-h-[70vh]">
        <div className="wrap py-4">
          <nav className="flex gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <span>Статус заказа</span>
          </nav>
        </div>

        <div className="wrap max-w-2xl mt-6">
          <h1
            className="mb-8 text-[clamp(28px,4vw,44px)] font-semibold leading-tight"
            style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
          >
            Статус заказа
          </h1>

          {!order && !error && (
            <p style={{ color: 'var(--muted)' }}>Загрузка...</p>
          )}

          {error && (
            <div
              className="rounded-xl p-6 text-center"
              style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}
            >
              <p className="mb-4 text-[15px]" style={{ color: 'var(--ink)' }}>Заказ не найден.</p>
              <p className="text-[13px]" style={{ color: 'var(--muted)' }}>
                Проверьте ссылку или{' '}
                <Link href="/" className="underline underline-offset-2 hover:text-accent">
                  вернитесь на главную
                </Link>.
              </p>
            </div>
          )}

          {order && order.status !== 'CANCELLED' && (
            <>
              {/* Order header */}
              <div
                className="mb-6 flex flex-wrap items-start justify-between gap-4 rounded-xl p-5"
                style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}
              >
                <div>
                  <p className="text-[13px] mb-1" style={{ color: 'var(--muted)' }}>Номер заказа</p>
                  <p className="text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                    {order.number}
                  </p>
                  <p className="mt-1 text-[12px]" style={{ color: 'var(--muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] mb-1" style={{ color: 'var(--muted)' }}>Сумма</p>
                  <p className="text-[20px] font-semibold" style={{ color: 'var(--ink)' }}>
                    {fmt(order.total)}
                  </p>
                  {order.paymentStatus === 'PAID' && (
                    <span className="mt-1 inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-medium text-green-700">
                      Оплачен
                    </span>
                  )}
                </div>
              </div>

              {/* Progress timeline */}
              <div
                className="mb-6 rounded-xl p-5"
                style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}
              >
                <p className="mb-4 text-[13px] font-semibold tracking-[0.06em] uppercase" style={{ color: 'var(--muted)' }}>
                  Прогресс
                </p>
                <div className="relative">
                  {/* Track line */}
                  <div
                    className="absolute left-[11px] top-3 bottom-3 w-[2px]"
                    style={{ background: 'var(--line)' }}
                  />
                  <div className="flex flex-col gap-0">
                    {STEPS.map((label, i) => {
                      const done = i < currentStep
                      const active = i === currentStep
                      return (
                        <div key={label} className="relative flex items-center gap-4 py-2.5">
                          <div
                            className="relative z-10 flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full border-2"
                            style={{
                              borderColor: done || active ? 'var(--accent)' : 'var(--line)',
                              background: done ? 'var(--accent)' : active ? 'var(--cream-2)' : 'var(--cream)',
                            }}
                          >
                            {done && (
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5">
                                <path d="M2 6l3 3 5-5" />
                              </svg>
                            )}
                            {active && (
                              <div className="h-2 w-2 rounded-full" style={{ background: 'var(--accent)' }} />
                            )}
                          </div>
                          <span
                            className="text-[14px]"
                            style={{
                              color: active ? 'var(--ink)' : done ? 'var(--muted)' : 'var(--line)',
                              fontWeight: active ? 600 : 400,
                            }}
                          >
                            {label}
                          </span>
                          {active && (
                            <span
                              className="ml-auto rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                              style={{ background: 'var(--sand)', color: 'var(--accent)' }}
                            >
                              Сейчас
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div
                className="rounded-xl p-5"
                style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}
              >
                <p className="mb-4 text-[13px] font-semibold tracking-[0.06em] uppercase" style={{ color: 'var(--muted)' }}>
                  Состав заказа
                </p>
                <div className="flex flex-col gap-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[14px]" style={{ color: 'var(--ink)' }}>{item.productName}</p>
                        <p className="text-[12px]" style={{ color: 'var(--muted)' }}>{item.quantity} шт. × {fmt(item.unitPrice)}</p>
                      </div>
                      <p className="text-[14px] font-semibold" style={{ color: 'var(--ink)' }}>
                        {fmt(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                {(order.discount > 0 || order.promoDiscount > 0 || order.deliveryFee > 0) && (
                  <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--line)' }}>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-[13px]" style={{ color: 'var(--muted)' }}>
                        <span>Скидка</span><span>−{fmt(order.discount)}</span>
                      </div>
                    )}
                    {order.promoDiscount > 0 && (
                      <div className="flex justify-between text-[13px]" style={{ color: 'var(--muted)' }}>
                        <span>Промокод</span><span>−{fmt(order.promoDiscount)}</span>
                      </div>
                    )}
                    {order.deliveryFee > 0 && (
                      <div className="flex justify-between text-[13px]" style={{ color: 'var(--muted)' }}>
                        <span>Доставка</span><span>{fmt(order.deliveryFee)}</span>
                      </div>
                    )}
                  </div>
                )}
                <div
                  className="mt-4 flex justify-between border-t pt-4 text-[15px] font-semibold"
                  style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
                >
                  <span>Итого</span>
                  <span>{fmt(order.total)}</span>
                </div>

                {order.paymentMethod === 'INVOICE' && order.invoiceNumber && (
                  <a
                    href={`/api/orders/${order.id}/invoice`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline mt-4 w-full justify-center text-[13px]"
                  >
                    Скачать счёт {order.invoiceNumber}
                  </a>
                )}
              </div>
            </>
          )}

          {order && order.status === 'CANCELLED' && (
            <div
              className="rounded-xl p-6 text-center"
              style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}
            >
              <p className="mb-2 text-[16px] font-semibold" style={{ color: 'var(--ink)' }}>
                Заказ {order.number} отменён
              </p>
              <p className="text-[13px]" style={{ color: 'var(--muted)' }}>
                Если у вас вопросы, свяжитесь с нами.
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-[13px]" style={{ color: 'var(--muted)' }}>
              Вопросы?{' '}
              <a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL ?? 'hello@akusto.ru'}`} className="underline underline-offset-2 hover:text-accent">
                {process.env.NEXT_PUBLIC_EMAIL ?? 'hello@akusto.ru'}
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
