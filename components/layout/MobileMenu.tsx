'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_ITEMS } from '@/constants'
import type { NavItem } from '@/types'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

function MobileNavItem({ item, index, onClose }: { item: NavItem; index: number; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0, transition: { delay: index * 0.06 + 0.15, ease: [0.16, 1, 0.3, 1], duration: 0.4 } }}
    >
      <div className="border-b" style={{ borderColor: 'var(--line)' }}>
        {item.children ? (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex w-full items-center justify-between py-3 text-left"
            >
              <span
                className="text-[34px] font-semibold"
                style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
              >
                {item.label}
              </span>
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-[20px] leading-none transition-all duration-200"
                style={{
                  color: 'var(--muted)',
                  background: 'var(--sand)',
                  transform: expanded ? 'rotate(45deg)' : 'none',
                }}
              >
                +
              </span>
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ height: 0, opacity: 0, transition: { duration: 0.18 } }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 pl-2 flex flex-col gap-0.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onClose}
                        className="block py-2 pl-3 text-[17px] border-l-2 transition-all hover:text-accent hover:border-accent"
                        style={{ color: 'var(--muted)', borderColor: 'var(--line)' }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <Link
            href={item.href}
            onClick={onClose}
            className="block py-3 text-[34px] font-semibold transition-colors duration-200 hover:text-accent"
            style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
          >
            {item.label}
          </Link>
        )}
      </div>
    </motion.div>
  )
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col justify-center overflow-y-auto px-9 py-16"
          style={{ background: 'var(--cream)' }}
          initial={{ x: '100%' }}
          animate={{ x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ x: '100%', transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } }}
        >
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-4xl leading-none"
            aria-label="Закрыть"
            style={{ color: 'var(--ink)' }}
          >
            ×
          </button>

          <nav className="flex flex-col">
            {NAV_ITEMS.map((item, i) => (
              <MobileNavItem key={item.href} item={item} index={i} onClose={onClose} />
            ))}
          </nav>

          <motion.div
            className="mt-8 flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
          >
            <a
              href={'tel:' + (process.env.NEXT_PUBLIC_PHONE ?? '+79777903983')}
              className="text-lg font-medium"
              style={{ color: 'var(--ink)' }}
            >
              {process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? '+7 977 790-39-83'}
            </a>
            <a
              href={'mailto:' + (process.env.NEXT_PUBLIC_EMAIL ?? 'hello@akusto.ru')}
              className="text-sm"
              style={{ color: 'var(--muted)' }}
            >
              {process.env.NEXT_PUBLIC_EMAIL ?? 'hello@akusto.ru'}
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
