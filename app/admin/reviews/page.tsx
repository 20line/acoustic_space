'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Review {
  id: string
  productId: string
  name: string
  rating: number
  text: string
  approved: boolean
  createdAt: string
  user: { name: string | null; email: string | null } | null
}

export default function AdminReviewsPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending')
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const qs = new URLSearchParams({ page: String(page) })
    if (filter === 'pending') qs.set('approved', 'false')
    if (filter === 'approved') qs.set('approved', 'true')
    const res = await fetch(`/api/admin/reviews?${qs}`)
    if (res.status === 403) { router.replace('/login'); return }
    const data = await res.json()
    setReviews(data.reviews)
    setTotal(data.total)
    setPages(data.pages)
    setLoading(false)
  }

  useEffect(() => { load() }, [page, filter]) // eslint-disable-line react-hooks/exhaustive-deps

  async function approve(id: string) {
    setWorking(id)
    await fetch('/api/admin/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved: true }),
    })
    setWorking(null)
    load()
  }

  async function reject(id: string) {
    setWorking(id)
    await fetch('/api/admin/reviews', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setWorking(null)
    load()
  }

  return (
    <div className="py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-2xl font-semibold text-[#2C2C2C]">Отзывы · {total}</h1>
          <div className="flex gap-1 rounded-xl bg-white p-1 shadow-sm">
            {(['pending', 'approved', 'all'] as const).map((f) => {
              const labels = { pending: 'На модерации', approved: 'Одобрены', all: 'Все' }
              return (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setPage(1) }}
                  className="rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors"
                  style={{
                    background: filter === f ? '#2C2C2C' : 'transparent',
                    color: filter === f ? '#fff' : '#888',
                  }}
                >
                  {labels[f]}
                </button>
              )
            })}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-xl bg-white animate-pulse" />)}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-400 text-center py-20">Отзывов нет</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-semibold text-[#2C2C2C] text-[15px]">{r.name}</span>
                      <span className="text-[13px] text-amber-500">
                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                      </span>
                      {r.approved ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">Одобрен</span>
                      ) : (
                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[11px] font-medium text-yellow-700">На модерации</span>
                      )}
                    </div>
                    {r.user && (
                      <p className="text-[12px] text-gray-400 mb-2">
                        {r.user.name}{r.user.email ? ` · ${r.user.email}` : ''}
                      </p>
                    )}
                    <p className="text-[14px] text-gray-700 leading-relaxed">{r.text}</p>
                    <p className="mt-2 text-[11px] text-gray-400">
                      {new Date(r.createdAt).toLocaleString('ru-RU')} · productId: {r.productId}
                    </p>
                  </div>

                  {!r.approved && (
                    <div className="flex flex-shrink-0 gap-2">
                      <button
                        onClick={() => approve(r.id)}
                        disabled={working === r.id}
                        className="rounded-lg bg-green-600 px-3 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
                      >
                        Одобрить
                      </button>
                      <button
                        onClick={() => reject(r.id)}
                        disabled={working === r.id}
                        className="rounded-lg border border-red-200 bg-white px-3 py-2 text-[13px] font-medium text-red-500 transition-opacity hover:bg-red-50 disabled:opacity-40"
                      >
                        Удалить
                      </button>
                    </div>
                  )}
                  {r.approved && (
                    <button
                      onClick={() => reject(r.id)}
                      disabled={working === r.id}
                      className="flex-shrink-0 rounded-lg border border-red-200 px-3 py-2 text-[13px] font-medium text-red-400 transition-colors hover:bg-red-50 disabled:opacity-40"
                    >
                      Удалить
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  p === page ? 'bg-[#2C2C2C] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
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
