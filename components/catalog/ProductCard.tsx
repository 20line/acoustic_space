'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface ProductCardProps {
  id: string
  slug: string
  category: string
  name: string
  tagline: string
  thumbnail: string
  price: number
  priceUnit: string
  delay?: number
  size?: 'default' | 'small'
}

export function ProductCard({
  id, slug, category, name, tagline, thumbnail, price, priceUnit,
  size = 'default',
}: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAdd = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    await addItem({ productId: id, productName: name, unitPrice: price * 100, quantity: 1 })
    setLoading(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }, [addItem, id, name, price])

  const titleSize = size === 'small' ? 'text-[20px]' : 'text-[24px]'

  return (
    <div className="group relative overflow-hidden rounded-[8px] shadow-premium" style={{ background: 'var(--cream-2)' }}>
      {/* Whole card is a link */}
      <Link href={`/catalog/${category}/${slug}`} className="block" tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-[16/11] overflow-hidden">
          <Image
            src={thumbnail}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.06]"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM3YzUyMzIiLz48L3N2Zz4="
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 -z-10 tex-walnut" />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(105deg,rgba(255,255,255,.16),transparent 42%)' }}
            aria-hidden
          />
        </div>
      </Link>

      <div className="p-5 pb-6">
        <Link href={`/catalog/${category}/${slug}`}>
          <h3
            className={`mb-1 ${titleSize} font-semibold leading-tight transition-colors hover:text-[var(--accent)]`}
            style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
          >
            {name}
          </h3>
        </Link>
        <p className="mb-4 text-[13px] line-clamp-2" style={{ color: 'var(--muted)' }}>{tagline}</p>

        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="block text-[14px] font-semibold" style={{ color: 'var(--ink)' }}>
              от {price.toLocaleString('ru-RU')} ₽
            </span>
            <span className="block text-[11px] tracking-[0.04em]" style={{ color: 'var(--muted)' }}>
              {priceUnit}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Add to cart */}
            <button
              onClick={handleAdd}
              disabled={loading}
              aria-label="В заявку"
              title="Добавить в заявку"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-200"
              style={{
                borderColor: added ? 'var(--accent)' : 'var(--line)',
                background: added ? 'var(--accent)' : 'transparent',
                color: added ? '#fff' : 'var(--accent)',
              }}
            >
              {added ? <Check size={15} strokeWidth={2.5} /> : <ShoppingCart size={15} strokeWidth={1.5} />}
            </button>

            {/* Details link */}
            <Link
              href={`/catalog/${category}/${slug}`}
              className="inline-flex items-center gap-1 text-[13px] font-semibold transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              Подробнее
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
