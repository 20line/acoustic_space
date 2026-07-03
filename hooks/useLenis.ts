'use client'

import { useEffect, useRef } from 'react'

export function useLenis() {
  const lenisRef = useRef<unknown>(null)

  useEffect(() => {
    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null

    async function initLenis() {
      try {
        const { default: Lenis } = await import('lenis')
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
        }) as { raf: (time: number) => void; destroy: () => void }

        lenisRef.current = lenis

        function raf(time: number) {
          lenis!.raf(time)
          requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
      } catch {
        // Lenis not available - falls back to native scroll
      }
    }

    initLenis()

    return () => {
      if (lenis) {
        lenis.destroy()
      }
    }
  }, [])

  return lenisRef
}
