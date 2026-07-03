import Link from 'next/link'
import Image from 'next/image'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { SEGMENTS } from '@/constants'

export function SegmentsSection() {
  return (
    <section className="pad" id="segments">
      <div className="wrap">
        <RevealWrapper className="sec-head">
          <span className="eyebrow">Для кого</span>
          <h2
            className="sec-h text-[clamp(34px,4.8vw,58px)]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Решения под вашу задачу
          </h2>
        </RevealWrapper>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SEGMENTS.map((seg, i) => (
            <RevealWrapper key={seg.id} delay={i * 60}>
              <Link
                href={seg.href}
                className={`group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[8px] shadow-premium`}
              >
                <Image
                  src={seg.image}
                  alt={seg.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.06]"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMyIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM1YTQ2MzYiLz48L3N2Zz4="
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                />
                {/* Fallback */}
                <div className={`absolute inset-0 -z-10 ${seg.bgClass}`} aria-hidden />
                {/* Overlay */}
                <div className="absolute inset-0 gradient-bottom" aria-hidden />
                {/* Content */}
                <div className="relative z-10 p-6 text-white">
                  <h3
                    className="text-[26px] font-semibold"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    {seg.title}
                  </h3>
                  <p className="mt-1.5 text-[13px]" style={{ color: 'rgba(255,255,255,0.82)' }}>
                    {seg.description}
                  </p>
                </div>
              </Link>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}
