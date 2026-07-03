'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart, formatPrice } from '@/context/CartContext'
import type { CartItem } from '@/types/cart'

export function CartDrawer() {
  const { cart, loading, drawerOpen, closeDrawer, updateItem, removeItem } = useCart()
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawerOpen, closeDrawer])

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const items = cart?.items ?? []
  const total = cart?.total ?? 0

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={closeDrawer}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
        }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Ваша заявка"
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col shadow-2xl transition-transform duration-300 ease-out"
        style={{
          background: 'var(--cream)',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-5"
          style={{ borderColor: 'var(--line)' }}
        >
          <h2
            className="text-[22px] font-semibold"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Ваша заявка
            {items.length > 0 && (
              <span className="ml-2 text-[15px] font-normal" style={{ color: 'var(--muted)' }}>
                {items.length} {pluralize(items.length, 'позиция', 'позиции', 'позиций')}
              </span>
            )}
          </h2>
          <button
            onClick={closeDrawer}
            aria-label="Закрыть корзину"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/8"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && items.length === 0 ? (
            <CartSkeleton />
          ) : items.length === 0 ? (
            <CartEmpty onClose={closeDrawer} />
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdate={updateItem}
                  onRemove={removeItem}
                  loading={loading}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="border-t px-6 py-5 space-y-4"
            style={{ borderColor: 'var(--line)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[15px]" style={{ color: 'var(--muted)' }}>
                Итого
              </span>
              <span className="text-[22px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {formatPrice(total)}
              </span>
            </div>

            <p className="text-[12px]" style={{ color: 'var(--muted)' }}>
              Точная стоимость, условия доставки и скидки согласовываются с менеджером
            </p>

            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="flex w-full items-center justify-center gap-2 rounded-[6px] py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Оформить заявку
              <ArrowRight size={16} />
            </Link>

            <button
              onClick={closeDrawer}
              className="w-full text-center text-[13px] transition-colors"
              style={{ color: 'var(--muted)' }}
            >
              Продолжить покупки
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

// ─── Item row ─────────────────────────────────────────────────────────────────

function CartItemRow({
  item,
  onUpdate,
  onRemove,
  loading,
}: {
  item: CartItem
  onUpdate: (id: string, qty: number) => Promise<void>
  onRemove: (id: string) => Promise<void>
  loading: boolean
}) {
  return (
    <li
      className="flex gap-4 rounded-[8px] p-3"
      style={{ background: 'var(--cream-2)', opacity: loading ? 0.6 : 1 }}
    >
      {/* Product info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-[14px] font-semibold leading-snug">{item.productName}</p>
        {item.config && Object.keys(item.config).length > 0 && (
          <p className="mt-0.5 text-[11px] truncate" style={{ color: 'var(--muted)' }}>
            {Object.entries(item.config)
              .filter(([, v]) => v)
              .map(([, v]) => v)
              .join(' · ')}
          </p>
        )}
        <p className="mt-1 text-[13px] font-semibold" style={{ color: 'var(--accent)' }}>
          {formatPrice(item.unitPrice * item.quantity)}
        </p>
      </div>

      {/* Qty controls + remove */}
      <div className="flex flex-col items-end justify-between gap-2">
        <button
          onClick={() => onRemove(item.id)}
          disabled={loading}
          aria-label="Удалить"
          className="flex h-7 w-7 items-center justify-center rounded transition-colors hover:text-red-500"
          style={{ color: 'var(--muted)' }}
        >
          <Trash2 size={14} strokeWidth={1.5} />
        </button>

        <div
          className="flex items-center gap-1.5 rounded-full px-2 py-1"
          style={{ border: '1px solid var(--line)' }}
        >
          <button
            onClick={() => onUpdate(item.id, item.quantity - 1)}
            disabled={loading || item.quantity <= 1}
            aria-label="Уменьшить количество"
            className="flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-black/8 disabled:opacity-30"
          >
            <Minus size={12} />
          </button>
          <span className="w-5 text-center text-[13px] font-semibold">{item.quantity}</span>
          <button
            onClick={() => onUpdate(item.id, item.quantity + 1)}
            disabled={loading}
            aria-label="Увеличить количество"
            className="flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-black/8"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </li>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function CartEmpty({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <ShoppingBag size={48} strokeWidth={1} style={{ color: 'var(--muted)' }} />
      <p
        className="mt-4 text-[20px] font-semibold"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        Заявка пуста
      </p>
      <p className="mt-2 text-[13px]" style={{ color: 'var(--muted)' }}>
        Добавьте изделия из каталога, чтобы оформить заявку на расчёт
      </p>
      <Link
        href="/catalog"
        onClick={onClose}
        className="mt-6 inline-flex items-center gap-2 rounded-[6px] px-6 py-3 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: 'var(--accent)' }}
      >
        Перейти в каталог
        <ArrowRight size={14} />
      </Link>
    </div>
  )
}

function CartSkeleton() {
  return (
    <ul className="space-y-4">
      {[1, 2].map((i) => (
        <li key={i} className="h-20 animate-pulse rounded-[8px]" style={{ background: 'var(--cream-2)' }} />
      ))}
    </ul>
  )
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}
