import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { RevealWrapper } from '@/components/ui/RevealWrapper'

const BLUR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM3YzUyMzIiLz48L3N2Zz4='

export function ProductionSection() {
  return (
    <section className="pad">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          <RevealWrapper className="order-last lg:order-first">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-premium">
              <Image
                src="/images/about/workshop.jpg"
                alt="Производство ACOUSTIC SPACE"
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR}
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              <div
                className="absolute inset-0 -z-10"
                style={{ background: 'repeating-linear-gradient(90deg,#86593a 0 16px,#6f4830 16px 19px,#9a6c45 19px 35px,#5d3c25 35px 38px)' }}
              />
            </div>
          </RevealWrapper>

          <RevealWrapper delay={100}>
            <span className="eyebrow block mb-4">О производстве</span>
            <h2
              className="text-[clamp(28px,4vw,48px)] font-semibold leading-tight mb-6"
              style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
            >
              Акустическое
              <br />зодчество
            </h2>
            <div
              className="text-[16px] leading-relaxed flex flex-col gap-4 mb-8 max-w-[480px]"
              style={{ color: 'var(--muted)' }}
            >
              <p>
                Мы относимся к акустике как к архитектуре. Каждое изделие рассчитано под геометрию, материалы и назначение помещения — не на глаз, а по измерениям.
              </p>
              <p>
                Собственный производственный участок позволяет контролировать качество на каждом этапе — от подбора материалов до контрольного измерения после монтажа.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[14px] font-semibold transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              Подробнее о нас и производстве
              <ArrowRight size={15} />
            </Link>
          </RevealWrapper>
        </div>
      </div>
    </section>
  )
}
