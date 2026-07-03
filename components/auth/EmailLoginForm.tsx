'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(1, 'Введите пароль'),
})
type FormData = z.infer<typeof schema>

export function EmailLoginForm({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const router = useRouter()
  const [showPwd, setShowPwd] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError('')
    const res = await signIn('email', {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    if (res?.error) {
      setServerError('Неверный email или пароль')
      return
    }
    router.push('/account')
    router.refresh()
  }

  const fc = cn(
    'w-full rounded-[8px] border px-4 py-3 text-[14px] outline-none transition-all',
    'focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10',
    'placeholder:text-[var(--muted)]',
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          autoComplete="email"
          className={cn(fc, errors.email && 'border-red-400')}
          style={{ background: 'var(--cream)', borderColor: errors.email ? undefined : 'var(--line)', color: 'var(--ink)' }}
        />
        {errors.email && <p className="mt-1 text-[12px] text-red-500">{errors.email.message}</p>}
      </div>

      <div className="relative">
        <input
          {...register('password')}
          type={showPwd ? 'text' : 'password'}
          placeholder="Пароль"
          autoComplete="current-password"
          className={cn(fc, 'pr-11', errors.password && 'border-red-400')}
          style={{ background: 'var(--cream)', borderColor: errors.password ? undefined : 'var(--line)', color: 'var(--ink)' }}
        />
        <button
          type="button"
          onClick={() => setShowPwd((v) => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
          tabIndex={-1}
        >
          {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        {errors.password && <p className="mt-1 text-[12px] text-red-500">{errors.password.message}</p>}
      </div>

      {serverError && (
        <p className="rounded-[6px] bg-red-50 px-4 py-2.5 text-[13px] text-red-600">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-dark w-full justify-center gap-2 disabled:opacity-60"
      >
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        Войти
      </button>

      <p className="text-center text-[13px]" style={{ color: 'var(--muted)' }}>
        Нет аккаунта?{' '}
        <button type="button" onClick={onSwitchToRegister} className="font-semibold underline" style={{ color: 'var(--accent)' }}>
          Зарегистрироваться
        </button>
      </p>
    </form>
  )
}
