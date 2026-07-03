'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Preloader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
          style={{ background: 'var(--cream)' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
            className="flex flex-col items-center gap-6"
          >
            <span
              className="text-[clamp(28px,5vw,48px)] tracking-[0.34em] font-semibold"
              style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
            >
              ACOUSTIC SPACE
            </span>
            <div className="relative h-px w-32 overflow-hidden bg-[var(--sand)]">
              <motion.div
                className="absolute inset-y-0 left-0 bg-[var(--accent)]"
                initial={{ width: '0%' }}
                animate={{ width: '100%', transition: { duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] } }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
