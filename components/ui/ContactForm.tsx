'use client'

import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from './Button'
import { ROOM_TYPES } from '@/constants'

const schema = z.object({
  name: z.string().min(2, 'Введите имя').max(100),
  phone: z
    .string()
    .min(10, 'Введите корректный телефон')
    .regex(/^[\d\s\+\-\(\)]+$/, 'Некорректный формат'),
  email: z.string().email('Некорректный email').or(z.literal('')).optional(),
  telegram: z.string().optional(),
  roomType: z.string().min(1, 'Выберите тип помещения'),
  comment: z.string().max(1000).optional(),
})

type FormValues = z.infer<typeof schema>

interface ContactFormProps {
  onSuccess?: () => void
  compact?: boolean
  defaultComment?: string
}

export function ContactForm({ onSuccess, compact = false, defaultComment }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [dragOver, setDragOver] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { comment: defaultComment } })

  const onSubmit = async (data: FormValues) => {
    setStatus('loading')
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => {
        if (v) formData.append(k, v as string)
      })
      files.forEach((f) => formData.append('files', f))

      const res = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Request failed')

      setStatus('success')
      reset()
      setFiles([])
      onSuccess?.()
    } catch {
      setStatus('error')
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = Array.from(e.dataTransfer.files).slice(0, 5)
    setFiles((prev) => [...prev, ...dropped].slice(0, 5))
  }, [])

  const fieldClass =
    'w-full rounded-xl border bg-white/60 px-4 py-3 text-[14px] text-ink outline-none transition-all duration-200 focus:border-accent focus:bg-white placeholder:text-muted'
  const errorFieldClass = 'border-red-300'
  const normalFieldClass = 'border-[var(--line)]'

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: 'var(--sand)' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3
          className="text-2xl font-semibold"
          style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
        >
          Заявка отправлена
        </h3>
        <p className="max-w-xs text-sm" style={{ color: 'var(--muted)' }}>
          Мы свяжемся с вами в течение 30 минут в рабочее время.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 text-sm underline underline-offset-4"
          style={{ color: 'var(--accent)' }}
        >
          Отправить ещё одну заявку
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className={compact ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-4'}>
        <div>
          <input
            {...register('name')}
            placeholder="Ваше имя *"
            className={`${fieldClass} ${errors.name ? errorFieldClass : normalFieldClass}`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <input
            {...register('phone')}
            placeholder="+7 977 790-39-83 *"
            type="tel"
            className={`${fieldClass} ${errors.phone ? errorFieldClass : normalFieldClass}`}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
        </div>
      </div>

      <div className={compact ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-4'}>
        <input
          {...register('email')}
          placeholder="Email"
          type="email"
          className={`${fieldClass} ${normalFieldClass}`}
        />
        <div>
          <input
            {...register('telegram')}
            placeholder="@username (Telegram)"
            className={`${fieldClass} ${normalFieldClass}`}
          />
          <p className="mt-1 text-[11px]" style={{ color: 'var(--muted)' }}>
            По желанию — для быстрого ответа
          </p>
        </div>
      </div>

      <div>
        <select
          {...register('roomType')}
          className={`${fieldClass} ${errors.roomType ? errorFieldClass : normalFieldClass}`}
          defaultValue=""
        >
          <option value="" disabled>
            Тип помещения *
          </option>
          {ROOM_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.roomType && <p className="mt-1 text-xs text-red-500">{errors.roomType.message}</p>}
      </div>

      <textarea
        {...register('comment')}
        placeholder="Расскажите о задаче — площадь, цели, сроки..."
        rows={compact ? 3 : 4}
        className={`${fieldClass} ${normalFieldClass} resize-none`}
      />

      {!compact && (
        <div
          className={`relative flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 text-center transition-all duration-200 ${
            dragOver ? 'border-accent bg-[var(--sand)]' : 'border-[var(--line)]'
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="1.5"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          <p className="text-[13px]" style={{ color: 'var(--muted)' }}>
            Перетащите файлы или{' '}
            <label className="cursor-pointer underline underline-offset-2" style={{ color: 'var(--accent)' }}>
              выберите
              <input
                type="file"
                multiple
                className="sr-only"
                accept="image/*,.pdf"
                onChange={(e) => {
                  if (e.target.files) {
                    setFiles((prev) => [...prev, ...Array.from(e.target.files!)].slice(0, 5))
                  }
                }}
              />
            </label>
          </p>
          {files.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {files.map((f, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 rounded-full px-3 py-1 text-[12px]"
                  style={{ background: 'var(--sand)', color: 'var(--ink)' }}
                >
                  {f.name}
                  <button
                    type="button"
                    onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                    className="ml-1 opacity-60 hover:opacity-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {status === 'error' && (
        <p className="text-sm text-red-500">Ошибка отправки. Попробуйте снова или позвоните нам.</p>
      )}

      <Button type="submit" variant="dark" loading={status === 'loading'} className="w-full justify-center">
        Рассчитать проект
      </Button>

      <p className="text-center text-[11px]" style={{ color: 'var(--muted)' }}>
        Отправляя форму, вы соглашаетесь с{' '}
        <a href="/privacy" className="underline underline-offset-2">
          политикой конфиденциальности
        </a>
      </p>
    </form>
  )
}
