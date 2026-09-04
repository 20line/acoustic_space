'use client'

import { useRef, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, Phone, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConsentCheckbox } from '@/components/ui/ConsentCheckbox'

type Step = 'phone' | 'code'

export function PhoneForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [normalizedPhone, setNormalizedPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [consent, setConsent] = useState(false)
  const codeInputRef = useRef<HTMLInputElement>(null)

  const startCountdown = () => {
    setCountdown(60)
    const interval = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) { clearInterval(interval); return 0 }
        return n - 1
      })
    }, 1000)
  }

  const sendCode = async (phoneValue = phone) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneValue }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Ошибка отправки'); return }
      setNormalizedPhone(data.phone)
      setStep('code')
      startCountdown()
      setTimeout(() => codeInputRef.current?.focus(), 100)
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await signIn('phone', {
        phone: normalizedPhone,
        code,
        redirect: false,
      })
      if (res?.error) {
        setError('Неверный или истёкший код. Попробуйте ещё раз.')
        return
      }
      router.push('/account')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const fc = cn(
    'w-full rounded-[8px] border px-4 py-3 text-[14px] outline-none transition-all',
    'focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10',
    'placeholder:text-[var(--muted)]',
  )

  if (step === 'phone') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-[8px] px-4 py-3" style={{ background: 'var(--cream-2)' }}>
          <Phone size={16} style={{ color: 'var(--muted)' }} />
          <p className="text-[13px]" style={{ color: 'var(--muted)' }}>
            Отправим 6-значный код на ваш номер
          </p>
        </div>

        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          placeholder="+7 (900) 000-00-00"
          autoComplete="tel"
          onKeyDown={(e) => e.key === 'Enter' && consent && phone.length >= 10 && sendCode()}
          className={fc}
          style={{ background: 'var(--cream)', borderColor: 'var(--line)', color: 'var(--ink)' }}
        />

        {error && <p className="rounded-[6px] bg-red-50 px-4 py-2.5 text-[13px] text-red-600">{error}</p>}

        <ConsentCheckbox checked={consent} onChange={setConsent} />

        <button
          onClick={() => sendCode()}
          disabled={loading || !consent || phone.replace(/\D/g, '').length < 10}
          className="btn btn-dark w-full justify-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Получить код
        </button>

        <p className="text-center text-[12px]" style={{ color: 'var(--muted)' }}>
          SMS не приходит? Воспользуйтесь входом по email.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-[8px] px-4 py-3" style={{ background: 'var(--cream-2)' }}>
        <ShieldCheck size={16} style={{ color: 'var(--accent)' }} />
        <p className="text-[13px]" style={{ color: 'var(--muted)' }}>
          Код отправлен на <strong style={{ color: 'var(--ink)' }}>+{normalizedPhone}</strong>
        </p>
      </div>

      <input
        ref={codeInputRef}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="• • • • • •"
        maxLength={6}
        onKeyDown={(e) => e.key === 'Enter' && code.length === 6 && verifyCode()}
        className={cn(fc, 'text-center text-[24px] tracking-[0.4em] font-semibold')}
        style={{ background: 'var(--cream)', borderColor: 'var(--line)', color: 'var(--ink)' }}
      />

      {error && <p className="rounded-[6px] bg-red-50 px-4 py-2.5 text-[13px] text-red-600">{error}</p>}

      <button
        onClick={verifyCode}
        disabled={loading || code.length !== 6}
        className="btn btn-dark w-full justify-center gap-2 disabled:opacity-60"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        Подтвердить
      </button>

      <div className="text-center text-[13px]" style={{ color: 'var(--muted)' }}>
        {countdown > 0 ? (
          <span>Повторно через {countdown} с</span>
        ) : (
          <button
            onClick={() => sendCode()}
            className="font-semibold underline"
            style={{ color: 'var(--accent)' }}
          >
            Отправить код повторно
          </button>
        )}
        {' · '}
        <button onClick={() => { setStep('phone'); setCode(''); setError('') }} style={{ color: 'var(--muted)' }}>
          Изменить номер
        </button>
      </div>
    </div>
  )
}
