'use client'

import { useScroll } from '@/hooks/useScroll'
import { motion, AnimatePresence } from 'framer-motion'

export function BackToTop() {
  const { scrollY } = useScroll()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {scrollY > 800 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollToTop}
          aria-label="Вернуться наверх"
          className="fixed bottom-28 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
          style={{
            background: 'var(--cream-2)',
            borderColor: 'var(--line)',
            color: 'var(--ink)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
