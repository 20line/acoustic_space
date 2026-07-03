'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { Modal } from '@/components/ui/Modal'
import { ContactForm } from '@/components/ui/ContactForm'

const COLORS = [
  { name: 'Дуб натуральный', hex: '#C4A47A' },
  { name: 'Дуб беленый', hex: '#E8DCC8' },
  { name: 'Дуб копченый', hex: '#7A5A3A' },
  { name: 'Орех', hex: '#6B4226' },
  { name: 'Антрацит', hex: '#2C2C2C' },
  { name: 'Слоновая кость', hex: '#F5F0E8' },
  { name: 'Графит', hex: '#4A4A4A' },
  { name: 'Серо-бежевый', hex: '#C8BDB0' },
]

const MATERIALS = [
  { value: 'slatted', label: 'Реечные', priceBase: 9800 },
  { value: 'fabric', label: 'Тканевые', priceBase: 7400 },
  { value: 'artistic', label: 'Художественные', priceBase: 14200 },
  { value: 'bass-traps', label: 'Басовые ловушки', priceBase: 12600 },
  { value: 'diffusers', label: 'Диффузоры', priceBase: 11400 },
]

const THICKNESSES = ['40 мм', '60 мм', '80 мм', '120 мм']

export default function ConfiguratorClient() {
  const [color, setColor] = useState(0)
  const [material, setMaterial] = useState(0)
  const [thickness, setThickness] = useState(0)
  const [area, setArea] = useState(10)
  const [lighting, setLighting] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  const selectedMaterial = MATERIALS[material]
  const basePrice = selectedMaterial?.priceBase ?? 9800
  const lightingMultiplier = lighting ? 1.18 : 1
  const thicknessMultiplier = [1, 1.08, 1.15, 1.25][thickness] ?? 1
  const total = Math.round(basePrice * lightingMultiplier * thicknessMultiplier * area)

  return (
    <>
      <ProgressBar />
      <Header />
      <main className="pt-24">
        <div className="wrap py-4">
          <nav className="flex gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>Конфигуратор</span>
          </nav>
        </div>

        <section className="pad pt-8">
          <div className="wrap">
            <RevealWrapper className="max-w-[560px] mb-14">
              <span className="eyebrow block mb-4">Конфигуратор</span>
              <h1 className="text-[clamp(32px,4.5vw,56px)] font-semibold leading-tight" style={{ fontFamily: 'var(--font-cormorant)' }}>
                Создайте свою панель
              </h1>
              <p className="mt-4 text-[16px]" style={{ color: 'var(--muted)' }}>
                Выберите тип, материал и параметры — мы рассчитаем стоимость.
              </p>
            </RevealWrapper>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
              {/* Options */}
              <div className="flex flex-col gap-10">
                {/* Material type */}
                <RevealWrapper>
                  <ConfigSection title="Тип панелей">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                      {MATERIALS.map((m, i) => (
                        <button
                          key={m.value}
                          onClick={() => setMaterial(i)}
                          className="rounded-xl border p-4 text-center transition-all duration-200"
                          style={{
                            borderColor: material === i ? 'var(--accent)' : 'var(--line)',
                            background: material === i ? 'var(--sand)' : 'var(--cream-2)',
                            color: 'var(--ink)',
                          }}
                        >
                          <div className="text-[12px] font-semibold">{m.label}</div>
                          <div className="mt-1 text-[11px]" style={{ color: 'var(--muted)' }}>
                            от {m.priceBase.toLocaleString('ru-RU')} ₽/м²
                          </div>
                        </button>
                      ))}
                    </div>
                  </ConfigSection>
                </RevealWrapper>

                {/* Color */}
                <RevealWrapper delay={70}>
                  <ConfigSection title="Цвет / порода">
                    <div className="flex flex-wrap gap-3">
                      {COLORS.map((c, i) => (
                        <button
                          key={c.name}
                          onClick={() => setColor(i)}
                          title={c.name}
                          className={`group relative flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-200 ${
                            color === i ? 'border-[var(--accent)] shadow-sm' : 'border-[var(--line)]'
                          }`}
                          style={{ background: 'var(--cream-2)' }}
                        >
                          <span className="h-4 w-4 rounded-full border border-white shadow-sm" style={{ background: c.hex }} />
                          <span className="text-[13px]" style={{ color: 'var(--ink)' }}>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </ConfigSection>
                </RevealWrapper>

                {/* Thickness */}
                <RevealWrapper delay={140}>
                  <ConfigSection title="Толщина">
                    <div className="flex flex-wrap gap-3">
                      {THICKNESSES.map((t, i) => (
                        <button
                          key={t}
                          onClick={() => setThickness(i)}
                          className="rounded-full border px-5 py-2.5 text-[13px] font-semibold transition-all duration-200"
                          style={{
                            borderColor: thickness === i ? 'var(--accent)' : 'var(--line)',
                            color: thickness === i ? '#fff' : 'var(--ink)',
                            background: thickness === i ? 'var(--accent)' : 'transparent',
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </ConfigSection>
                </RevealWrapper>

                {/* Area */}
                <RevealWrapper delay={210}>
                  <ConfigSection title={`Площадь: ${area} м²`}>
                    <input
                      type="range"
                      min={1}
                      max={200}
                      value={area}
                      onChange={(e) => setArea(Number(e.target.value))}
                      className="w-full"
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <div className="flex justify-between text-[12px] mt-2" style={{ color: 'var(--muted)' }}>
                      <span>1 м²</span>
                      <span>100 м²</span>
                      <span>200 м²</span>
                    </div>
                  </ConfigSection>
                </RevealWrapper>

                {/* Lighting */}
                <RevealWrapper delay={280}>
                  <ConfigSection title="Подсветка">
                    <button
                      onClick={() => setLighting((p) => !p)}
                      className="flex items-center gap-3 text-[14px]"
                    >
                      <span
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                        style={{ background: lighting ? 'var(--accent)' : 'var(--taupe)' }}
                      >
                        <span
                          className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
                          style={{ transform: lighting ? 'translateX(22px)' : 'translateX(4px)' }}
                        />
                      </span>
                      <span style={{ color: 'var(--ink)' }}>
                        {lighting ? 'Встроенная LED-подсветка (+18%)' : 'Без подсветки'}
                      </span>
                    </button>
                  </ConfigSection>
                </RevealWrapper>
              </div>

              {/* Summary */}
              <RevealWrapper delay={100}>
                <div
                  className="sticky top-24 rounded-2xl p-7 shadow-premium"
                  style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}
                >
                  {/* Preview */}
                  <div
                    className="mb-6 aspect-[4/3] rounded-xl"
                    style={{
                      background: material === 0
                        ? 'repeating-linear-gradient(90deg,#7c5232 0 13px,#6a4528 13px 16px,#8a6038 16px 30px,#5d3c22 30px 33px)'
                        : COLORS[color]
                        ? `linear-gradient(135deg, ${COLORS[color].hex}, ${COLORS[color].hex}88)`
                        : 'var(--sand)',
                    }}
                  />

                  <h2 className="text-[22px] font-semibold mb-1" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {MATERIALS[material]?.label}
                  </h2>
                  <p className="text-[14px] mb-6" style={{ color: 'var(--muted)' }}>
                    {COLORS[color]?.name} · {THICKNESSES[thickness]} · {area} м²
                    {lighting ? ' · Подсветка' : ''}
                  </p>

                  <div className="border-t border-b py-5 mb-6" style={{ borderColor: 'var(--line)' }}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[14px]" style={{ color: 'var(--muted)' }}>Ориентировочная стоимость</span>
                    </div>
                    <div className="mt-1 text-[32px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                      от {total.toLocaleString('ru-RU')} ₽
                    </div>
                    <p className="mt-1 text-[11px]" style={{ color: 'var(--muted)' }}>
                      Точная стоимость — после замера объекта
                    </p>
                  </div>

                  <button onClick={() => setContactOpen(true)} className="btn btn-dark w-full justify-center">
                    Заказать расчёт
                  </button>
                  <Link href="/calculator" className="btn btn-out w-full justify-center mt-3">
                    Детальный калькулятор
                  </Link>
                </div>
              </RevealWrapper>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <FloatingContact />

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} title="Заказать расчёт" size="lg">
        <ContactForm onSuccess={() => setContactOpen(false)} />
      </Modal>
    </>
  )
}

function ConfigSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-[14px] font-semibold tracking-[0.08em] uppercase" style={{ color: 'var(--muted)' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}
