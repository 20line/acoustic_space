'use client'

import { useState } from 'react'
import { EmailLoginForm } from './EmailLoginForm'
import { EmailRegisterForm } from './EmailRegisterForm'
import { PhoneForm } from './PhoneForm'

type Tab = 'email' | 'phone'
type Mode = 'login' | 'register'

export function AuthTabs({ defaultTab = 'email' }: { defaultTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(defaultTab)
  const [mode, setMode] = useState<Mode>('login')

  return (
    <div className="w-full max-w-[420px]">
      {/* Tab selector */}
      <div
        className="mb-6 flex rounded-[8px] p-1"
        style={{ background: 'var(--cream-2)' }}
      >
        {(['email', 'phone'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 rounded-[6px] py-2.5 text-[13px] font-semibold transition-all duration-200"
            style={{
              background: tab === t ? 'var(--cream)' : 'transparent',
              color: tab === t ? 'var(--ink)' : 'var(--muted)',
              boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {t === 'email' ? 'Email' : 'Телефон'}
          </button>
        ))}
      </div>

      {tab === 'email' ? (
        <>
          {mode === 'login' ? (
            <EmailLoginForm onSwitchToRegister={() => setMode('register')} />
          ) : (
            <EmailRegisterForm onSwitchToLogin={() => setMode('login')} />
          )}
        </>
      ) : (
        <PhoneForm />
      )}
    </div>
  )
}
