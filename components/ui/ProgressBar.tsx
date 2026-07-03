'use client'

import { useScroll } from '@/hooks/useScroll'
import { motion, useSpring, useTransform } from 'framer-motion'

export function ProgressBar() {
  const { scrollProgress } = useScroll()

  const spring = useSpring(scrollProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const scaleX = useTransform(spring, [0, 100], [0, 1])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left"
      style={{
        scaleX,
        background: 'var(--accent)',
      }}
    />
  )
}
