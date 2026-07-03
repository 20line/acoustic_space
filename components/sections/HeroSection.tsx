'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 120])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <section ref={ref} className="relative min-h-[86vh] flex items-center overflow-hidden">
      {/* Background with parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        {/* Replace with real image: public/images/hero/hero-main.jpg */}
        <Image
          src="/images/hero/hero-main.jpg"
          alt="Премиальные акустические панели"
          fill
          priority
          quality={95}
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzdiNTIzMiIvPjwvc3ZnPg=="
          sizes="100vw"
        />
        {/* Fallback gradient when no image */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(120% 90% at 78% 18%, rgba(60,72,96,.55), transparent 46%),
              radial-gradient(80% 70% at 30% 65%, rgba(212,186,150,.5), transparent 60%),
              linear-gradient(160deg,#6f5a44 0%,#8a7050 30%,#b39a78 60%,#cdb594 100%)
            `,
          }}
          aria-hidden
        />
        {/* Walnut slats overlay left */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[34%]"
          style={{
            background: 'repeating-linear-gradient(90deg,#7c5232 0 9px,#6a4528 9px 11px,#8a6038 11px 20px,#5d3c22 20px 22px)',
            boxShadow: 'inset -40px 0 60px -30px rgba(0,0,0,.4)',
            opacity: 0.96,
          }}
          aria-hidden
        />
        {/* Glow */}
        <div
          className="absolute right-[12%] top-[30%] h-[300px] w-[230px] rounded-full"
          style={{
            background: 'radial-gradient(circle,rgba(255,238,210,.5),transparent 65%)',
            filter: 'blur(8px)',
          }}
          aria-hidden
        />
        {/* Shade */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg,rgba(20,14,8,.42),transparent 55%),linear-gradient(0deg,rgba(20,14,8,.3),transparent 40%)',
          }}
          aria-hidden
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full pb-[200px] pt-[148px] md:pb-[180px] md:pt-[165px]">
        <div className="wrap">
          <motion.div
            className="max-w-[660px] text-white pl-0 md:pl-[6%]"
            style={{ opacity }}
          >
            <motion.span
              className="eyebrow mb-4 block text-white/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
            >
              Акустические решения премиум-класса
            </motion.span>

            <motion.h1
              className="display text-[clamp(46px,8vw,98px)] text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
            >
              Тишина
              <br />и стиль.
              <span
                className="mt-3.5 block font-sans font-medium text-white/94 normal-case tracking-normal"
                style={{ fontSize: 'clamp(20px,3vw,34px)', lineHeight: 1.18 }}
              >
                Преобразите пространство премиальными
                <br className="hidden sm:block" />
                акустическими панелями.
              </span>
            </motion.h1>

            <motion.div
              className="mt-9 flex flex-wrap gap-3.5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
            >
              <Link href="/catalog" className="btn btn-light">
                В каталог
              </Link>
              <Link href="/contacts" className="btn btn-ghost-light">
                Рассчитать проект
              </Link>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="mt-16 hidden items-center gap-3 md:flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1.2, duration: 0.6 } }}
            >
              <motion.div
                className="h-10 w-px"
                style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.5))' }}
                animate={{ scaleY: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span className="text-[11px] tracking-[0.2em] text-white/60 uppercase">Scroll</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
