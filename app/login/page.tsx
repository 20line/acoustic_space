import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AuthTabs } from '@/components/auth/AuthTabs'

export const metadata: Metadata = {
  title: 'Войти · ACOUSTIC SPACE',
  robots: { index: false, follow: false },
}

export default async function LoginPage() {
  const session = await getServerSession(authOptions)
  if (session) redirect('/account')

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <h1
            className="text-[36px] font-semibold"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Войти
          </h1>
          <p className="mt-2 text-[14px]" style={{ color: 'var(--muted)' }}>
            ACOUSTIC SPACE — личный кабинет
          </p>
        </div>
        <AuthTabs />
      </div>
    </main>
  )
}
