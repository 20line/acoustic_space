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
import { ROOM_TYPES, PANEL_TYPES } from '@/constants'
import type { CalculatorResult } from '@/types'

function calculate(
  roomType: string,
  area: number,
  ceiling: number,
  panelType: string,
  walls: number
): CalculatorResult {
  const panelTypeDef = PANEL_TYPES.find((p) => p.value === panelType)
  const pricePerSqm = panelTypeDef?.pricePerSqm ?? 9800

  const wallHeight = ceiling
  const wallWidth = Math.sqrt(area)
  const wallArea = wallWidth * wallHeight * walls
  const coveragePercent = roomType.includes('студ') ? 0.55 : roomType.includes('кинотеатр') ? 0.5 : 0.3
  const panelsArea = Math.ceil(wallArea * coveragePercent)
  const minCost = panelsArea * pricePerSqm
  const maxCost = Math.round(minCost * 1.35)

  const recommendation =
    area < 20
      ? 'Небольшое помещение — акцент на угловых ловушках и панелях в зоне первых отражений.'
      : area < 50
      ? 'Оптимальный объём для профессиональной обработки. Рекомендуем комбинацию поглощающих и рассеивающих панелей.'
      : 'Большое пространство — потребуется потолочная обработка плюс стены. Рассчитаем индивидуально.'

  return { minCost, maxCost, panelsArea, recommendation }
}

export default function CalculatorClient() {
  const [roomType, setRoomType] = useState(ROOM_TYPES[0])
  const [area, setArea] = useState(30)
  const [ceiling, setCeiling] = useState(2.8)
  const [panelType, setPanelType] = useState('slatted')
  const [walls, setWalls] = useState(4)
  const [result, setResult] = useState<CalculatorResult | null>(null)
  const [contactOpen, setContactOpen] = useState(false)

  const onCalculate = () => {
    setResult(calculate(roomType, area, ceiling, panelType, walls))
  }

  return (
    <>
      <ProgressBar />
      <Header />
      <main className="pt-24">
        <div className="wrap py-4">
          <nav className="flex gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>Калькулятор</span>
          </nav>
        </div>

        <section className="pad pt-8">
          <div className="wrap">
            <RevealWrapper className="max-w-[560px] mb-10">
              <span className="eyebrow block mb-4">Калькулятор стоимости</span>
              <h1 className="text-[clamp(32px,4.5vw,56px)] font-semibold leading-tight" style={{ fontFamily: 'var(--font-cormorant)' }}>
                Рассчитайте бюджет
              </h1>
              <p className="mt-4 text-[16px]" style={{ color: 'var(--muted)' }}>
                Введите параметры помещения — получите ориентировочную стоимость.
              </p>
            </RevealWrapper>

            {/* Cross-link to Room Designer */}
            <RevealWrapper className="mb-6">
              <Link
                href="/room-designer"
                className="group flex items-center gap-5 rounded-2xl border p-5 transition-all duration-200 hover:border-[var(--taupe)] hover:shadow-card sm:max-w-lg"
                style={{ background: 'var(--sand)', borderColor: 'var(--accent)' }}
              >
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-[22px]"
                  style={{ background: 'var(--cream-2)' }}
                >
                  🏠
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold" style={{ color: 'var(--ink)' }}>
                    Интерактивный акустический проект помещения
                  </p>
                  <p className="text-[13px] mt-0.5" style={{ color: 'var(--muted)' }}>
                    2D-план, развёртки стен, 3D-вид, RT60, список панелей — новый инструмент
                  </p>
                </div>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="var(--muted)" strokeWidth="1.8"
                  className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </RevealWrapper>

            {/* Cross-link to Schroeder diffuser calculator */}
            <RevealWrapper className="mb-14">
              <Link
                href="/diffuser"
                className="group flex items-center gap-5 rounded-2xl border p-5 transition-all duration-200 hover:border-[var(--taupe)] hover:shadow-card sm:max-w-lg"
                style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}
              >
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-[22px]"
                  style={{ background: 'var(--sand)' }}
                >
                  ◫
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold" style={{ color: 'var(--ink)' }}>
                    Калькулятор диффузора Шрёдера (QRD)
                  </p>
                  <p className="text-[13px] mt-0.5" style={{ color: 'var(--muted)' }}>
                    Рассчитайте глубину ячеек, схему и спецификацию для заказа
                  </p>
                </div>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="var(--muted)" strokeWidth="1.8"
                  className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </RevealWrapper>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
              <RevealWrapper>
                <div className="flex flex-col gap-7">
                  <FormRow label="Тип помещения">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {ROOM_TYPES.map((rt) => (
                        <button
                          key={rt}
                          onClick={() => setRoomType(rt)}
                          className="rounded-xl border px-4 py-3 text-[13px] text-left transition-all"
                          style={{
                            borderColor: roomType === rt ? 'var(--accent)' : 'var(--line)',
                            background: roomType === rt ? 'var(--sand)' : 'var(--cream-2)',
                            color: 'var(--ink)',
                          }}
                        >
                          {rt}
                        </button>
                      ))}
                    </div>
                  </FormRow>

                  <FormRow label={`Площадь помещения: ${area} м²`}>
                    <input type="range" min={5} max={300} value={area} onChange={(e) => setArea(Number(e.target.value))}
                      className="w-full" style={{ accentColor: 'var(--accent)' }} />
                    <div className="flex justify-between text-[12px] mt-1" style={{ color: 'var(--muted)' }}>
                      <span>5 м²</span><span>300 м²</span>
                    </div>
                  </FormRow>

                  <FormRow label={`Высота потолков: ${ceiling} м`}>
                    <input type="range" min={2.2} max={6} step={0.1} value={ceiling} onChange={(e) => setCeiling(Number(e.target.value))}
                      className="w-full" style={{ accentColor: 'var(--accent)' }} />
                    <div className="flex justify-between text-[12px] mt-1" style={{ color: 'var(--muted)' }}>
                      <span>2.2 м</span><span>6 м</span>
                    </div>
                  </FormRow>

                  <FormRow label="Тип панелей">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {PANEL_TYPES.map((pt) => (
                        <button
                          key={pt.value}
                          onClick={() => setPanelType(pt.value)}
                          className="rounded-xl border px-4 py-3 text-left transition-all"
                          style={{
                            borderColor: panelType === pt.value ? 'var(--accent)' : 'var(--line)',
                            background: panelType === pt.value ? 'var(--sand)' : 'var(--cream-2)',
                            color: 'var(--ink)',
                          }}
                        >
                          <div className="text-[13px] font-semibold">{pt.label}</div>
                          <div className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
                            {pt.pricePerSqm.toLocaleString('ru-RU')} ₽/м²
                          </div>
                        </button>
                      ))}
                    </div>
                  </FormRow>

                  <FormRow label={`Количество обрабатываемых стен: ${walls}`}>
                    <input type="range" min={1} max={6} value={walls} onChange={(e) => setWalls(Number(e.target.value))}
                      className="w-full" style={{ accentColor: 'var(--accent)' }} />
                    <div className="flex justify-between text-[12px] mt-1" style={{ color: 'var(--muted)' }}>
                      <span>1</span><span>4</span><span>6</span>
                    </div>
                  </FormRow>

                  <button onClick={onCalculate} className="btn btn-dark self-start">
                    Рассчитать стоимость
                  </button>
                </div>
              </RevealWrapper>

              {/* Result */}
              <RevealWrapper delay={100}>
                <div
                  className="sticky top-24 rounded-2xl p-7"
                  style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}
                >
                  {result ? (
                    <>
                      <h2 className="text-[22px] font-semibold mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
                        Ориентировочный расчёт
                      </h2>
                      <div className="flex flex-col gap-3 mb-6">
                        <ResultRow label="Площадь панелей" value={`~${result.panelsArea} м²`} />
                        <ResultRow label="Стоимость (мин.)" value={`${result.minCost.toLocaleString('ru-RU')} ₽`} />
                        <ResultRow label="Стоимость (макс.)" value={`${result.maxCost.toLocaleString('ru-RU')} ₽`} />
                      </div>
                      <div className="rounded-xl p-4 mb-6" style={{ background: 'var(--sand)' }}>
                        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--ink)' }}>
                          {result.recommendation}
                        </p>
                      </div>
                      <button onClick={() => setContactOpen(true)} className="btn btn-dark w-full justify-center">
                        Получить точный расчёт
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-full"
                        style={{ background: 'var(--sand)' }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--taupe)" strokeWidth="1.5">
                          <path d="M9 7h6M9 12h6M9 17h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                        </svg>
                      </div>
                      <p className="text-[14px]" style={{ color: 'var(--muted)' }}>
                        Заполните параметры и нажмите «Рассчитать»
                      </p>
                    </div>
                  )}
                </div>
              </RevealWrapper>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <FloatingContact />

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} title="Получить точный расчёт" size="lg">
        <ContactForm onSuccess={() => setContactOpen(false)} />
      </Modal>
    </>
  )
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-[14px] font-semibold tracking-[0.06em] uppercase" style={{ color: 'var(--muted)' }}>{label}</h3>
      {children}
    </div>
  )
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 text-[14px] border-b" style={{ borderColor: 'var(--line)' }}>
      <span style={{ color: 'var(--muted)' }}>{label}</span>
      <span className="font-semibold" style={{ color: 'var(--ink)' }}>{value}</span>
    </div>
  )
}
