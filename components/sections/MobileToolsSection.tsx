import Link from 'next/link'
import { MOBILE_TOOLS } from '@/constants'

/**
 * Mobile-only quick access to the calculators. On desktop these live in the
 * "Инструменты" nav dropdown and the footer; on phones that puts them far out
 * of reach, so we surface them high on the home page.
 */
export function MobileToolsSection() {
  return (
    <section className="md:hidden py-10" style={{ background: 'var(--cream-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <span className="eyebrow block mb-1">Инструменты</span>
        <h2
          className="mb-4 text-[24px] font-semibold leading-tight"
          style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
        >
          Рассчитайте онлайн
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {MOBILE_TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="flex flex-col gap-2 rounded-xl border p-4 transition-colors active:border-accent"
              style={{ borderColor: 'var(--line)', background: 'var(--cream)' }}
            >
              <span className="text-[22px] leading-none" aria-hidden>{tool.icon}</span>
              <span className="text-[14px] font-medium leading-tight" style={{ color: 'var(--ink)' }}>
                {tool.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
