'use client'

import { useState } from 'react'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { reviews, videoReview } from '@/data/reviews'
import { motion, AnimatePresence } from 'framer-motion'

export function ReviewsSection() {
  const [videoOpen, setVideoOpen] = useState(false)
  const displayReviews = reviews.slice(0, 2)

  return (
    <section className="pad">
      <div className="wrap">
        <RevealWrapper className="sec-head">
          <span className="eyebrow">Отзывы</span>
          <h2
            className="sec-h text-[clamp(34px,4.8vw,58px)]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Что говорят заказчики
          </h2>
        </RevealWrapper>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.2fr_1fr_1fr]">
          {/* First review */}
          <RevealWrapper>
            <div
              className="flex flex-col rounded-[8px] border p-8"
              style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}
            >
              <blockquote
                className="m-0 text-[24px] leading-[1.28]"
                style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
              >
                «{displayReviews[0]?.text}»
              </blockquote>
              <div className="mt-6">
                <b className="block text-[14px] font-semibold" style={{ color: 'var(--ink)' }}>
                  {displayReviews[0]?.author}
                </b>
                <span className="text-[13px]" style={{ color: 'var(--muted)' }}>
                  {displayReviews[0]?.role}
                </span>
              </div>
            </div>
          </RevealWrapper>

          {/* Video */}
          <RevealWrapper delay={70}>
            <button
              onClick={() => setVideoOpen(true)}
              className="group relative flex w-full flex-col items-center justify-center rounded-[8px] p-8 transition-all duration-300"
              style={{ background: 'linear-gradient(150deg,#3a2c20,#241b14)', minHeight: '200px' }}
              aria-label="Смотреть видеоотзыв"
            >
              <div
                className="grid h-16 w-16 place-items-center rounded-full border transition-all duration-300 group-hover:bg-white/15"
                style={{ borderColor: 'rgba(255,255,255,0.5)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: '3px' }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span
                className="mt-3 text-[10px] tracking-[0.14em] uppercase"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                видеоотзыв · {videoReview.duration}
              </span>
            </button>
          </RevealWrapper>

          {/* Second review */}
          <RevealWrapper delay={140}>
            <div
              className="flex flex-col rounded-[8px] border p-8"
              style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}
            >
              <blockquote
                className="m-0 text-[24px] leading-[1.28]"
                style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
              >
                «{displayReviews[1]?.text}»
              </blockquote>
              <div className="mt-6">
                <b className="block text-[14px] font-semibold" style={{ color: 'var(--ink)' }}>
                  {displayReviews[1]?.author}
                </b>
                <span className="text-[13px]" style={{ color: 'var(--muted)' }}>
                  {displayReviews[1]?.role}
                </span>
              </div>
            </div>
          </RevealWrapper>
        </div>
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {videoOpen && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0"
              style={{ background: 'rgba(20,14,8,0.85)', backdropFilter: 'blur(8px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setVideoOpen(false)}
            />
            <motion.div
              className="relative z-10 w-full max-w-3xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute -top-10 right-0 text-white/70 transition-colors hover:text-white"
                aria-label="Закрыть"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              <div className="aspect-video w-full overflow-hidden rounded-xl">
                <iframe
                  src={`${videoReview.videoUrl}?autoplay=1`}
                  className="h-full w-full"
                  allow="autoplay; fullscreen"
                  title={videoReview.title}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
