import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24">
        <div className="wrap py-8">
          <div className="flex gap-8 lg:gap-12">
            {/* Sidebar */}
            <aside className="hidden w-52 flex-shrink-0 lg:block">
              <div className="sticky top-28">
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
                  Мой кабинет
                </p>
                <p className="mb-5 text-[15px] font-semibold truncate" style={{ color: 'var(--ink)' }}>
                  {session.user.name ?? session.user.email ?? 'Клиент'}
                </p>
                <nav className="space-y-1">
                  {[
                    { href: '/account', label: 'Обзор' },
                    { href: '/account/orders', label: 'Мои заказы' },
                    { href: '/account/wishlist', label: 'Избранное' },
                    { href: '/account/profile', label: 'Профиль' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-[6px] px-3 py-2 text-[14px] transition-colors hover:bg-[var(--sand)]"
                      style={{ color: 'var(--ink)' }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
