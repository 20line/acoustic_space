'use client'

import { useEffect, useRef } from 'react'

export function useReveal(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in')
          io.unobserve(el)
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -7% 0px',
        ...options,
      }
    )

    io.observe(el)

    return () => io.unobserve(el)
  }, [options])

  return ref
}

export function useRevealGroup(selector = '.rv') {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(selector)
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -7% 0px' }
    )

    els.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 3) * 70}ms`
      io.observe(el)
    })

    return () => io.disconnect()
  }, [selector])
}
