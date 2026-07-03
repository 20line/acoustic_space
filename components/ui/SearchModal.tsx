'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { BookOpen, Search, X } from 'lucide-react'

type ProductResult = {
  type: 'product'
  id: string; slug: string; category: string; href: string
  name: string; tagline: string; thumbnail: string
  price: number; priceUnit: string
}

type BlogResult = {
  type: 'blog'
  id: string; slug: string; href: string
  name: string; tagline: string
}

type SearchResult = ProductResult | BlogResult

export function SearchButton({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setOpen(true) }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Поиск"
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
          light ? 'text-white/80 hover:text-white hover:bg-white/10' : 'hover:bg-black/8'
        }`}
      >
        <Search size={18} strokeWidth={1.5} />
      </button>

      {open && <SearchModal onClose={() => setOpen(false)} />}
    </>
  )
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => { inputRef.current?.focus() }, [])

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return }
    setLoading(true)
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
    setResults(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => search(query), 250)
    return () => clearTimeout(t)
  }, [query, search])

  function go(result: SearchResult) {
    router.push(result.href)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--cream)' }}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--line)' }}>
          <Search size={18} strokeWidth={1.5} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по каталогу..."
            className="flex-1 bg-transparent text-[15px] outline-none"
            style={{ color: 'var(--ink)' }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: 'var(--muted)' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results */}
        {loading && (
          <div className="px-5 py-4">
            <div className="space-y-2">
              {[1,2,3].map((i) => <div key={i} className="h-14 rounded-lg animate-pulse" style={{ background: 'var(--cream-2)' }} />)}
            </div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <ul className="max-h-[60vh] overflow-y-auto">
            {results.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => go(r)}
                  className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-[var(--cream-2)]"
                >
                  {r.type === 'product' ? (
                    <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image src={r.thumbnail} alt={r.name} fill className="object-cover" sizes="64px" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-16 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: 'var(--sand)' }}>
                      <BookOpen size={18} style={{ color: 'var(--muted)' }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[14px] font-semibold" style={{ color: 'var(--ink)' }}>{r.name}</p>
                    <p className="truncate text-[12px]" style={{ color: 'var(--muted)' }}>{r.tagline}</p>
                  </div>
                  {r.type === 'product' ? (
                    <span className="text-[13px] font-semibold whitespace-nowrap" style={{ color: 'var(--accent)' }}>
                      от {r.price.toLocaleString('ru-RU')} ₽
                    </span>
                  ) : (
                    <span className="rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap" style={{ background: 'var(--sand)', color: 'var(--muted)' }}>
                      Статья
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <div className="px-5 py-8 text-center text-[14px]" style={{ color: 'var(--muted)' }}>
            Ничего не найдено по запросу «{query}»
          </div>
        )}

        {query.length < 2 && (
          <div className="px-5 py-6 text-center text-[13px]" style={{ color: 'var(--muted)' }}>
            Начните вводить название панели...
          </div>
        )}
      </div>
    </div>
  )
}
