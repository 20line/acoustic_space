'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { ChevronDown } from 'lucide-react'
import type { FaqItem } from '@/types'

const CATEGORIES = [
  { value: 'all', label: 'Все вопросы' },
  { value: 'general', label: 'Общие' },
  { value: 'process', label: 'Процесс' },
  { value: 'pricing', label: 'Цены и гарантии' },
  { value: 'product', label: 'Продукт' },
]

export function FaqInteractive({ items }: { items: FaqItem[] }) {
  const [active, setActive] = useState('all')
  const [open, setOpen] = useState<string | null>(null)

  const filtered = active === 'all' ? items : items.filter((f) => f.category === active)

  return (
    <>
      {/* Category filter */}
      <RevealWrapper className="mb-10 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => { setActive(c.value); setOpen(null) }}
            className="rounded-full border px-5 py-2 text-[13px] font-semibold transition-all"
            style={{
              borderColor: active === c.value ? 'var(--accent)' : 'var(--line)',
              color: active === c.value ? '#fff' : 'var(--ink)',
              background: active === c.value ? 'var(--accent)' : 'transparent',
            }}
          >
            {c.label}
          </button>
        ))}
      </RevealWrapper>

      {/* Accordion */}
      <div className="max-w-3xl">
        {filtered.map((item, i) => (
          <RevealWrapper key={item.id} delay={(i % 5) * 50}>
            <div className="border-b overflow-hidden" style={{ borderColor: 'var(--line)' }}>
              <button
                onClick={() => setOpen(open === item.id ? null : item.id)}
                className="flex w-full items-start justify-between gap-4 py-5 text-left"
                aria-expanded={open === item.id}
              >
                <span className="text-[17px] font-medium" style={{ color: 'var(--ink)' }}>
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: open === item.id ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-shrink-0 mt-0.5"
                  aria-hidden
                >
                  <ChevronDown size={18} color="var(--muted)" />
                </motion.div>
              </button>

              <AnimatePresence>
                {open === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
                    exit={{ height: 0, opacity: 0, transition: { duration: 0.25 } }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-[15px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </RevealWrapper>
        ))}
      </div>
    </>
  )
}
