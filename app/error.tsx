'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ background: 'var(--cream)' }}>
      <span className="eyebrow block mb-4">Ошибка</span>
      <h1
        className="text-[clamp(32px,4vw,52px)] font-semibold mb-4"
        style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
      >
        Что-то пошло не так
      </h1>
      <p className="text-[15px] mb-8 max-w-md" style={{ color: 'var(--muted)' }}>
        Произошла непредвиденная ошибка. Попробуйте обновить страницу или вернитесь на главную.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={reset}
          className="rounded-lg px-6 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          Попробовать снова
        </button>
        <Link
          href="/"
          className="rounded-lg border px-6 py-3 text-[14px] font-semibold transition-colors hover:border-[var(--accent)] hover:text-accent"
          style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
        >
          На главную
        </Link>
      </div>
    </div>
  )
}
