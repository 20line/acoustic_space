'use client'

import { useEffect, useState, useCallback } from 'react'

export function useScroll(threshold = 560) {
  const [scrolled, setScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')

  const onScroll = useCallback(() => {
    const y = window.scrollY
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = totalHeight > 0 ? (y / totalHeight) * 100 : 0

    setScrolled(y > threshold)
    setScrollY(y)
    setScrollProgress(progress)
    setScrollDirection((prev) => {
      if (y > scrollY) return 'down'
      if (y < scrollY) return 'up'
      return prev
    })
  }, [threshold, scrollY])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  return { scrolled, scrollY, scrollProgress, scrollDirection }
}
