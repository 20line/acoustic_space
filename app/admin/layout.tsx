import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AdminNav } from './AdminNav'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Панель управления · ACOUSTIC SPACE',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen" style={{ background: '#F5F0EB' }}>
      <header style={{ background: '#2C2C2C' }} className="sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center gap-8 px-4 h-14">
          <span className="text-white text-[15px] font-semibold tracking-widest">ADMIN</span>
          <AdminNav />
          <Link
            href="/"
            className="ml-auto text-[12px] transition-opacity hover:opacity-100"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            ← На сайт
          </Link>
        </div>
      </header>
      {children}
    </div>
  )
}
