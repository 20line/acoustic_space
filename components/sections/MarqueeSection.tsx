'use client'

const TEXT = 'Акция при личном обращении — скидка 10% на первый заказ'
const SEPARATOR = ' · '

export function MarqueeSection() {
  const repeated = Array.from({ length: 12 }, () => TEXT + SEPARATOR).join('')

  return (
    <section
      className="overflow-hidden border-t border-b select-none relative z-20"
      style={{ borderColor: 'var(--line)', background: 'var(--walnut)', color: '#fff' }}
    >
      <div className="flex whitespace-nowrap py-3.5">
        <div className="marquee-track flex shrink-0 gap-0">
          <span
            className="inline-block text-[14px] font-semibold tracking-[0.08em] uppercase"
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            {repeated}
          </span>
          <span
            className="inline-block text-[14px] font-semibold tracking-[0.08em] uppercase"
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            {repeated}
          </span>
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee 40s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </section>
  )
}
