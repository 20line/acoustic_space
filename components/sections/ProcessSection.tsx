import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { PROCESS_STEPS } from '@/constants'

export function ProcessSection() {
  return (
    <section
      className="pad border-t border-b"
      style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}
    >
      <div className="wrap">
        <RevealWrapper className="mb-14" style={{ textAlign: 'left', marginLeft: 0 }}>
          <span className="eyebrow">Как мы работаем</span>
          <h2
            className="mt-4 text-[clamp(34px,4.8vw,58px)] font-semibold leading-[1.04]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Пять шагов до нужного звука
          </h2>
        </RevealWrapper>

        <div
          className="grid grid-cols-1 border-t sm:grid-cols-2 lg:grid-cols-5"
          style={{ borderColor: 'var(--line)' }}
        >
          {PROCESS_STEPS.map((step, i) => (
            <RevealWrapper
              key={step.number}
              delay={i * 80}
              className="border-r border-b pb-2 pr-6 pt-7 last:border-r-0 sm:last-odd:border-r-0 lg:border-b-0 lg:last:border-r-0"
              style={{ borderColor: 'var(--line)' }}
            >
              <div
                className="text-[40px] leading-none"
                style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--taupe)' }}
              >
                {step.number}
              </div>
              <h4
                className="mb-2 mt-3.5 text-[16px] font-semibold"
                style={{ color: 'var(--ink)', fontFamily: 'var(--font-manrope)' }}
              >
                {step.title}
              </h4>
              <p className="text-[13px]" style={{ color: 'var(--muted)' }}>
                {step.description}
              </p>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}
