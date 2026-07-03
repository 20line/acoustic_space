'use client'

import React, { useEffect, useRef, type ReactNode, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface RevealWrapperProps {
  children: ReactNode
  className?: string
  delay?: number
  threshold?: number
  as?: keyof React.JSX.IntrinsicElements
  style?: CSSProperties
}

export function RevealWrapper({
  children,
  className,
  delay = 0,
  threshold = 0.12,
  as: Tag = 'div',
  style,
}: RevealWrapperProps) {
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
      { threshold, rootMargin: '0px 0px -7% 0px' }
    )

    io.observe(el)
    return () => io.unobserve(el)
  }, [threshold])

  const AnyTag = Tag as React.ElementType

  return (
    <AnyTag
      ref={ref as React.RefObject<HTMLElement>}
      className={cn('rv', className)}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...style }}
    >
      {children}
    </AnyTag>
  )
}
