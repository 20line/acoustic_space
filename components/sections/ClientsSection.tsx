import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { CLIENTS } from '@/constants'
import Image from 'next/image'

export function ClientsSection() {
  return (
    <section
      className="border-t border-b py-16"
      style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}
    >
      <div className="wrap">
        <RevealWrapper>
          <p className="eyebrow mb-8 block text-center">С кем мы работали</p>
        </RevealWrapper>
        <RevealWrapper>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            {CLIENTS.map((client) => (
              <span
                key={client.id}
                className="cursor-default rounded-full border px-6 py-3 text-[22px] font-semibold transition-all duration-300 hover:border-[var(--taupe)] hover:text-ink"
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  color: 'var(--muted)',
                  borderColor: 'var(--line)',
                }}
              >
                {client.name}
              </span>
            ))}
          </div>
        </RevealWrapper>
      </div>
    </section>
  )
}
