'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { products } from '@/data/products'

export default function WishlistClient() {
  const [productIds, setProductIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/wishlist')
      .then((r) => r.json())
      .then((ids) => { setProductIds(ids); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function remove(productId: string) {
    await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })
    setProductIds((ids) => ids.filter((id) => id !== productId))
  }

  const wishlisted = products.filter((p) => productIds.includes(p.id))

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
        Избранное
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1,2].map((i) => <div key={i} className="h-48 rounded-xl animate-pulse" style={{ background: 'var(--cream-2)' }} />)}
        </div>
      ) : wishlisted.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={40} strokeWidth={1} style={{ color: 'var(--muted)' }} className="mx-auto mb-4" />
          <p style={{ color: 'var(--muted)' }} className="mb-4">Пока ничего не добавлено</p>
          <Link href="/catalog" className="btn btn-dark text-sm">Перейти в каталог</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishlisted.map((p) => (
            <div
              key={p.id}
              className="flex gap-4 rounded-xl p-4 relative"
              style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}
            >
              <Link href={`/catalog/${p.category}/${p.slug}`} className="relative w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                <Image src={p.thumbnail} alt={p.name} fill className="object-cover" sizes="96px" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/catalog/${p.category}/${p.slug}`} className="block text-[14px] font-semibold leading-snug hover:text-[var(--accent)] transition-colors">
                  {p.name}
                </Link>
                <p className="text-[13px] mt-1" style={{ color: 'var(--muted)' }}>от {p.price.toLocaleString('ru-RU')} ₽ {p.priceUnit}</p>
              </div>
              <button
                onClick={() => remove(p.id)}
                className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-red-50"
                title="Убрать из избранного"
              >
                <Heart size={15} fill="currentColor" className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
