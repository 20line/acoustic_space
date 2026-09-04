'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getConsent, setConsent } from '@/lib/consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!getConsent()) setVisible(true)
  }, [])

  const accept = () => {
    setConsent('accepted')
    setVisible(false)
  }

  const decline = () => {
    setConsent('declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[80] px-4 pb-4 sm:px-6 sm:pb-6"
      role="dialog"
      aria-label="Уведомление об использовании cookie"
    >
      <div
        className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl p-5 shadow-premium sm:flex-row sm:items-center sm:justify-between"
        style={{
          background: 'var(--cream)',
          border: '1px solid var(--line)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
          Мы используем технические cookie для работы корзины и авторизации — они необходимы и
          включены всегда. Аналитические cookie (Яндекс.Метрика) подключаются только после вашего
          согласия. Подробнее — в{' '}
          <Link
            href="/privacy"
            className="underline underline-offset-2 transition-colors hover:text-accent"
            style={{ color: 'var(--ink)' }}
          >
            политике конфиденциальности
          </Link>
          .
        </p>
        <div className="flex flex-shrink-0 gap-3">
          <button
            onClick={decline}
            className="whitespace-nowrap text-[13px] border rounded-lg transition-colors hover:border-[var(--accent)] hover:text-accent"
            style={{ padding: '9px 16px', borderColor: 'var(--line)', color: 'var(--muted)' }}
          >
            Только необходимые
          </button>
          <button
            onClick={accept}
            className="btn btn-dark whitespace-nowrap text-[13px]"
            style={{ padding: '9px 20px' }}
          >
            Принять все
          </button>
        </div>
      </div>
    </div>
  )
}
