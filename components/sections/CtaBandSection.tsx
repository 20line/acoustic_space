'use client'

import { useState } from 'react'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { Modal } from '@/components/ui/Modal'
import { ContactForm } from '@/components/ui/ContactForm'

export function CtaBandSection() {
  const [open, setOpen] = useState(false)
  const phone = process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? '+7 977 790-39-83'
  const phoneHref = `tel:${process.env.NEXT_PUBLIC_PHONE ?? '+79777903983'}`

  return (
    <>
      <section
        className="relative overflow-hidden text-center text-white"
        id="contacts"
        style={{ padding: 'clamp(80px,11vw,150px) 0' }}
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(70% 90% at 50% 10%,rgba(212,186,150,.4),transparent 55%),
                linear-gradient(160deg,#3a2c20,#241b14)
              `,
            }}
          />
          {/* Subtle slat pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.12,
              background: 'repeating-linear-gradient(90deg,#caa97f 0 2px,transparent 2px 26px)',
            }}
            aria-hidden
          />
        </div>

        <div className="wrap relative z-10">
          <RevealWrapper>
            <h2
              className="mx-auto mb-4 max-w-[860px] text-[clamp(36px,5.4vw,72px)] font-semibold leading-[1.04]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Готовы услышать
              <br />
              пространство иначе?
            </h2>
            <p className="mx-auto mb-9 max-w-[520px] text-[17px]" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Расскажите о помещении и задаче — подготовим предварительный акустический расчёт под ваш объект.
            </p>
            <div className="flex flex-wrap justify-center gap-3.5">
              <button onClick={() => setOpen(true)} className="btn btn-light">
                Рассчитать проект
              </button>
              <a href={phoneHref} className="btn btn-ghost-light">
                {phone}
              </a>
            </div>
          </RevealWrapper>
        </div>
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Рассчитать проект" size="lg">
        <ContactForm onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  )
}
