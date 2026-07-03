'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export function CartButton() {
  const { cart, openDrawer } = useCart()
  const count = cart?.count ?? 0

  return (
    <button
      onClick={openDrawer}
      aria-label={`Заявка${count > 0 ? `, ${count} позиций` : ''}`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-black/5"
      style={{ color: 'var(--ink)' }}
    >
      <ShoppingCart size={20} strokeWidth={1.5} />
      {count > 0 && (
        <span
          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white"
          style={{ background: 'var(--accent)' }}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
