import Image from 'next/image'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { STATS } from '@/constants'

export function AboutSection() {
  return (
    <section className="pad" id="about">
      <div className="wrap">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          {/* Text */}
          <RevealWrapper>
            <span className="eyebrow">Акустическое зодчество</span>
            <h2
              className="mt-4 mb-4 text-[clamp(32px,4.4vw,50px)] font-semibold leading-tight"
              style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
            >
              Не отделка,
              <br />а инженерия звука
            </h2>
            <p className="max-w-[460px] text-[17px]" style={{ color: 'var(--muted)' }}>
              Мы относимся к акустике как к архитектуре. Каждое изделие рассчитано под геометрию,
              материалы и назначение помещения — диффузия, поглощение и контроль низких частот не
              «на глаз», а по измерениям.
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-6">
              {STATS.map((stat, i) => (
                <RevealWrapper key={stat.value} delay={i * 70}>
                  <div
                    className="text-[34px] leading-none"
                    style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--walnut)' }}
                  >
                    {stat.value}
                  </div>
                  <h4 className="mt-2.5 mb-1 text-[15px] font-semibold" style={{ color: 'var(--ink)' }}>
                    {stat.label}
                  </h4>
                  <p className="text-[13.5px]" style={{ color: 'var(--muted)' }}>
                    {stat.description}
                  </p>
                </RevealWrapper>
              ))}
            </div>
          </RevealWrapper>

          {/* Visual */}
          <RevealWrapper className="order-first lg:order-last">
            <div
              className="relative overflow-hidden rounded-[8px] shadow-premium"
              style={{ aspectRatio: '4/5' }}
            >
              <Image
                src="/images/about/workshop.jpg"
                alt="Цех производства акустических панелей ACOUSTIC SPACE"
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSIxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjODY1OTNhIi8+PC9zdmc+"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              {/* Fallback */}
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background: 'repeating-linear-gradient(90deg,#86593a 0 16px,#6f4830 16px 19px,#9a6c45 19px 35px,#5d3c25 35px 38px)',
                }}
                aria-hidden
              />
              <span
                className="absolute bottom-3.5 left-4 rounded px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase"
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  background: 'rgba(0,0,0,0.22)',
                  fontFamily: 'var(--font-manrope)',
                }}
              >
                фото · цех / интерьер
              </span>
            </div>
          </RevealWrapper>
        </div>
      </div>
    </section>
  )
}
