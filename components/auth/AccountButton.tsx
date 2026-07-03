'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import { User, LogOut, Package, ChevronDown } from 'lucide-react'

export function AccountButton() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (status === 'loading') return <div className="h-9 w-9 rounded-full animate-pulse" style={{ background: 'var(--sand)' }} />

  if (!session) {
    return (
      <Link
        href="/login"
        className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-black/5"
        aria-label="Войти"
        style={{ color: 'var(--ink)' }}
      >
        <User size={20} strokeWidth={1.5} />
      </Link>
    )
  }

  const initials = session.user.name
    ? session.user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : (session.user.email?.[0] ?? 'А').toUpperCase()

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:bg-black/5"
        aria-label="Аккаунт"
      >
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ background: 'var(--accent)' }}
        >
          {initials}
        </div>
        <ChevronDown size={13} strokeWidth={2} style={{ color: 'var(--muted)' }} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl py-1.5 shadow-premium"
          style={{ background: 'var(--cream)', border: '1px solid var(--line)' }}
        >
          <div className="border-b px-4 py-3" style={{ borderColor: 'var(--line)' }}>
            <p className="truncate text-[13px] font-semibold" style={{ color: 'var(--ink)' }}>
              {session.user.name ?? 'Клиент'}
            </p>
            <p className="truncate text-[11px]" style={{ color: 'var(--muted)' }}>
              {session.user.email}
            </p>
          </div>

          {[
            { href: '/account', icon: User, label: 'Мой кабинет' },
            { href: '/account/orders', icon: Package, label: 'Мои заказы' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] transition-colors hover:bg-[var(--sand)]"
              style={{ color: 'var(--ink)' }}
            >
              <item.icon size={15} strokeWidth={1.5} />
              {item.label}
            </Link>
          ))}

          <div className="mt-1 border-t" style={{ borderColor: 'var(--line)' }}>
            <button
              onClick={() => { setOpen(false); signOut({ callbackUrl: '/' }) }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13.5px] transition-colors hover:bg-[var(--sand)]"
              style={{ color: 'var(--muted)' }}
            >
              <LogOut size={15} strokeWidth={1.5} />
              Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
