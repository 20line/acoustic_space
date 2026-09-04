'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConsentCheckbox } from '@/components/ui/ConsentCheckbox'

const schema = z.object({
  name: z.string().min(2, 'Минимум 2 символа').max(100),
  email: z.string().email('Неверный формат email'),
  password: z
    .string()
    .min(8, 'Минимум 8 символов')
    .regex(/[A-Za-z]/, 'Должен содержать латинские буквы')
    .regex(/[0-9]/, 'Должен содержать цифру'),
  consent: z.boolean().refine((v) => v === true, {
    message: 'Необходимо согласие на обработку персональных данных',
  }),
})
type FormData = z.infer<typeof schema>

export function EmailRegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const router = useRouter()
  const [showPwd, setShowPwd] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { consent: false } })

  const consentGiven = watch('consent') === true

  const onSubmit = async (data: FormData) => {
    setServerError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.name, email: data.email, password: data.password, consent: data.consent }),
    })

    if (!res.ok) {
      const json = await res.json()
      setServerError(json.error ?? 'Ошибка регистрации')
      return
    }

    // Auto sign-in after registration
    await signIn('email', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

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
          {...register('name')}
          placeholder="Имя"
          autoComplete="name"
          className={cn(fc, errors.name && 'border-red-400')}
          style={{ background: 'var(--cream)', borderColor: errors.name ? undefined : 'var(--line)', color: 'var(--ink)' }}
        />
        {errors.name && <p className="mt-1 text-[12px] text-red-500">{errors.name.message}</p>}
      </div>

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
          placeholder="Пароль (мин. 8 символов)"
          autoComplete="new-password"
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

      <ConsentCheckbox
        checked={consentGiven}
        onChange={(v) => setValue('consent', v, { shouldValidate: true })}
      />
      {errors.consent && <p className="-mt-2 text-[12px] text-red-500">{errors.consent.message}</p>}

      <button
        type="submit"
        disabled={isSubmitting || !consentGiven}
        className="btn btn-dark w-full justify-center gap-2 disabled:opacity-50"
      >
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        Создать аккаунт
      </button>

      <p className="text-center text-[13px]" style={{ color: 'var(--muted)' }}>
        Уже есть аккаунт?{' '}
        <button type="button" onClick={onSwitchToLogin} className="font-semibold underline" style={{ color: 'var(--accent)' }}>
          Войти
        </button>
      </p>
    </form>
  )
}
