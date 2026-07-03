'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin/orders', label: 'Заказы' },
  { href: '/admin/blog', label: 'Блог' },
  { href: '/admin/reviews', label: 'Отзывы' },
  { href: '/admin/users', label: 'Пользователи' },
]

export function AdminNav() {
  const path = usePathname()
  return (
    <nav className="flex gap-1">
      {NAV.map(({ href, label }) => {
        const active = path.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="rounded-lg px-3 py-1.5 text-[13px] transition-colors"
            style={{
              color: active ? '#fff' : 'rgba(255,255,255,0.6)',
              background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
            }}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
