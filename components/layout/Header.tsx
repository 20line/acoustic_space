'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useScroll } from '@/hooks/useScroll'
import { MobileMenu } from './MobileMenu'
import { NAV_ITEMS } from '@/constants'
import { cn } from '@/lib/utils'
import { CartButton } from '@/components/cart/CartButton'
import { AccountButton } from '@/components/auth/AccountButton'
import { SearchButton } from '@/components/ui/SearchModal'
import type { NavItem } from '@/types'

interface HeaderProps {
  transparent?: boolean
}

function DropdownMenu({ item, light = false }: { item: NavItem; light?: boolean }) {
  const [open, setOpen] = useState(false)

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className={cn(
          'text-[13.5px] tracking-[0.05em] transition-all duration-200',
          light
            ? 'text-white/90 hover:text-white hover:underline hover:underline-offset-6 hover:[text-decoration-thickness:1px]'
            : 'hover:text-accent'
        )}
        style={light ? undefined : { color: 'var(--ink)', opacity: 0.8 }}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={cn(
          'flex items-center gap-1 text-[13.5px] tracking-[0.05em] transition-all duration-200',
          light ? 'text-white/90 hover:text-white' : 'hover:text-accent',
          open && !light && 'text-accent'
        )}
        style={!light ? { color: 'var(--ink)', opacity: open ? 1 : 0.8 } : undefined}
      >
        {item.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={cn('mt-0.5 transition-transform duration-200', open && 'rotate-180')}
        >
          <path d="M2 4l4 4 4-4" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.18 } }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.14 } }}
          >
            <div
              className="min-w-[210px] overflow-hidden rounded-xl py-1.5 shadow-premium"
              style={{ background: 'var(--cream)', border: '1px solid var(--line)' }}
            >
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block px-5 py-2.5 text-[13.5px] transition-all duration-150 hover:bg-[var(--sand)]"
                  style={{ color: 'var(--ink)' }}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Header({ transparent = false }: HeaderProps) {
  const { scrolled } = useScroll(480)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  const phone = process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? '+7 977 790-39-83'
  const phoneRaw = process.env.NEXT_PUBLIC_PHONE ?? '+79777903983'

  return (
    <>
      {/* Transparent hero header */}
      {transparent && (
        <header className="absolute inset-x-0 top-0 z-50 text-white">
          <div className="text-center pb-3 pt-6">
            <Link
              href="/"
              className="inline-block text-[clamp(28px,4.4vw,46px)] font-semibold tracking-[0.34em] text-white"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              ACOUSTIC SPACE
            </Link>
          </div>
          <nav
            className="border-t border-b"
            style={{ borderColor: 'var(--line-light)' }}
          >
            <div className="wrap flex h-14 items-center justify-between">
              <div className="hidden items-center gap-10 sm:flex">
                {NAV_ITEMS.map((item) => (
                  <DropdownMenu key={item.href} item={item} light />
                ))}
              </div>
              <a
                href={'tel:' + phoneRaw}
                className="hidden text-[13px] tracking-[0.04em] text-white/80 transition-opacity hover:text-white sm:block"
              >
                {phone}
              </a>
              <button
                onClick={() => setMobileOpen(true)}
                className="flex flex-col gap-[5px] p-1.5 sm:hidden ml-auto"
                aria-label="Меню"
              >
                <span className="block h-[2px] w-6 bg-white" />
                <span className="block h-[2px] w-6 bg-white" />
                <span className="block h-[2px] w-6 bg-white" />
              </button>
            </div>
          </nav>
        </header>
      )}

      {/* Fixed mini header */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[55] border-b"
        style={{
          background: 'rgba(247,242,234,0.94)',
          backdropFilter: 'blur(14px)',
          borderColor: 'var(--line)',
        }}
        initial={{ y: -100 }}
        animate={{ y: scrolled ? 0 : -100 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="wrap flex h-[66px] items-center justify-between gap-6">
          <Link
            href="/"
            className="flex-shrink-0 text-2xl font-semibold tracking-[0.22em]"
            style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
          >
            ACOUSTIC SPACE
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => (
              <DropdownMenu key={item.href} item={item} />
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={'tel:' + phoneRaw}
              className="hidden text-[13px] font-medium transition-colors hover:text-accent lg:block"
              style={{ color: 'var(--ink)', opacity: 0.75 }}
            >
              {phone}
            </a>
            <SearchButton light={false} />
            <AccountButton />
            <CartButton />
            <button
              onClick={() => setContactOpen(true)}
              className="btn btn-dark hidden text-[13px] sm:inline-flex"
              style={{ padding: '10px 18px' }}
            >
              Рассчитать проект
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="flex flex-col gap-[5px] p-1.5 md:hidden"
              aria-label="Меню"
            >
              <span className="block h-[2px] w-6" style={{ background: 'var(--ink)' }} />
              <span className="block h-[2px] w-6" style={{ background: 'var(--ink)' }} />
              <span className="block h-[2px] w-6" style={{ background: 'var(--ink)' }} />
            </button>
          </div>
        </div>
      </motion.div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <AnimatePresence>
        {contactOpen && (
          <ContactModal onClose={() => setContactOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

function ContactModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0"
        style={{ background: 'rgba(36,27,20,0.5)', backdropFilter: 'blur(4px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 w-full max-w-xl rounded-2xl p-8 shadow-premium"
        style={{ background: 'var(--cream-2)' }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-[var(--sand)]"
          aria-label="Закрыть"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <h2
          className="mb-6 pr-8 text-[28px] font-semibold leading-tight"
          style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
        >
          Рассчитать проект
        </h2>
        <ContactFormInline onSuccess={onClose} />
      </motion.div>
    </div>
  )
}

function ContactFormInline({ onSuccess }: { onSuccess?: () => void }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'var(--sand)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
          Заявка отправлена
        </h3>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Свяжемся в течение 30 минут.</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/contact', { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      setStatus('success')
      setTimeout(() => onSuccess?.(), 1500)
    } catch {
      setStatus('error')
    }
  }

  const fc = 'w-full rounded-xl border bg-white/60 px-4 py-3 text-[14px] text-ink outline-none transition-all focus:border-accent focus:bg-white placeholder:text-muted'
  const bc = 'border-[var(--line)]'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <input required name="name" placeholder="Имя *" className={cn(fc, bc)} />
        <input required name="phone" placeholder="+7 977 790-39-83 *" type="tel" className={cn(fc, bc)} />
      </div>
      <input name="email" placeholder="Email" type="email" className={cn(fc, bc)} />
      <textarea name="comment" placeholder="Тип помещения, площадь, задача..." rows={3} className={cn(fc, bc, 'resize-none')} />
      {status === 'error' && <p className="text-sm text-red-500">Ошибка. Позвоните нам напрямую.</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn btn-dark w-full justify-center disabled:opacity-60"
      >
        {status === 'loading' ? 'Отправка...' : 'Рассчитать проект'}
      </button>
    </form>
  )
}
