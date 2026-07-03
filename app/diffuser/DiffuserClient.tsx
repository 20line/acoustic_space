'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { Modal } from '@/components/ui/Modal'
import { ContactForm } from '@/components/ui/ContactForm'
import { products } from '@/data/products'

// ─── Types ───────────────────────────────────────────────────────────────────

interface QRDCell {
  n: number
  residue: number
  depth: number // mm
}

interface QRDResult {
  cells: QRDCell[]
  unitDepth: number  // s = c / (2·N·F₀), mm
  cellWidth: number  // mm
  maxDepth: number   // mm
  totalWidth: number // mm
  fMin: number       // Hz
  fMax: number       // Hz
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PRIMES = [5, 7, 11, 13, 17, 23] as const

const PRIME_NOTES: Record<number, string> = {
  5:  'Компактная панель — 5 ячеек',
  7:  'Стандарт — 7 ячеек, оптимальный баланс',
  11: '11 ячеек, расширенный диапазон рассеяния',
  13: '13 ячеек, профессиональный контроль',
  17: '17 ячеек, широкое угловое покрытие',
  23: '23 ячейки, максимальная эффективность',
}

// ─── QRD computation ─────────────────────────────────────────────────────────

function r5(x: number): number {
  return Math.round(x / 5) * 5
}

function computeQRD(fo: number, N: number, c: number, wOverride: number | null): QRDResult {
  const unit = (c * 1000) / (2 * N * fo) // mm
  const cells: QRDCell[] = Array.from({ length: N }, (_, n) => ({
    n,
    residue: (n * n) % N,
    depth: r5(((n * n) % N) * unit),
  }))
  const maxDepth = Math.max(...cells.map((c) => c.depth))
  const cellWidth = wOverride ?? Math.max(20, r5(unit))
  return {
    cells,
    unitDepth: r5(unit),
    cellWidth,
    maxDepth,
    totalWidth: r5(cellWidth * N),
    fMin: fo,
    fMax: N * fo,
  }
}

// ─── Materials spec ───────────────────────────────────────────────────────────

interface SpecItem { label: string; dims: string; qty: number }

function buildSpec(cells: QRDCell[], cellWidth: number, panelLength: number) {
  const N = cells.length
  const maxDepth = Math.max(...cells.map((c) => c.depth))
  const byDepth = new Map<number, number>()
  cells.forEach((cell) => byDepth.set(cell.depth, (byDepth.get(cell.depth) ?? 0) + 1))

  const backing: SpecItem = {
    label: 'Задняя стенка',
    dims: `${Math.round(cellWidth * N)}×${panelLength}×25 мм`,
    qty: 1,
  }
  const dividers: SpecItem = {
    label: 'Перегородки',
    dims: `${Math.round(maxDepth)}×${panelLength}×20 мм`,
    qty: N + 1,
  }
  const fillers: SpecItem[] = Array.from(byDepth.entries())
    .filter(([depth]) => depth < maxDepth && depth >= 0)
    .sort(([a], [b]) => b - a)
    .map(([depth, qty]) => ({
      label: `Заглушка h=${Math.round(maxDepth - depth)} мм`,
      dims: `${Math.round(cellWidth)}×${panelLength}×${Math.round(maxDepth - depth)} мм`,
      qty,
    }))

  return { backing, dividers, fillers }
}

// ─── SVG cross-section ────────────────────────────────────────────────────────

function DiffuserSVG({ cells, maxDepth }: { cells: QRDCell[]; maxDepth: number }) {
  const N = cells.length
  const W = 520
  const TOP = 26
  const BODY_H = 148
  const BOT = 16
  const H = TOP + BODY_H + BOT
  const cellPx = (W - 2) / N
  const gap = Math.max(0.5, cellPx * 0.05)
  const mDepth = maxDepth || 1
  const scale = BODY_H / mDepth

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 220 }}>
      <defs>
        <linearGradient id="wellGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFE8DC" />
          <stop offset="100%" stopColor="#D9CCBA" />
        </linearGradient>
        <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A5A3A" />
          <stop offset="100%" stopColor="#5A3E22" />
        </linearGradient>
      </defs>

      {/* Panel body */}
      <rect x={1} y={TOP} width={W - 2} height={BODY_H} rx={4} fill="url(#panelGrad)" />

      {/* Subtle grid lines at 25%, 50%, 75% depth */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={1} y1={TOP + f * BODY_H}
          x2={W - 1} y2={TOP + f * BODY_H}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={1}
          strokeDasharray="3 5"
        />
      ))}

      {/* Wells */}
      {cells.map((cell, i) => {
        if (cell.depth <= 0) return null
        const dPx = cell.depth * scale
        return (
          <rect
            key={i}
            x={1 + i * cellPx + gap}
            y={TOP}
            width={cellPx - 2 * gap}
            height={dPx}
            fill="url(#wellGrad)"
          />
        )
      })}

      {/* Face dashed line */}
      <line
        x1={1} y1={TOP}
        x2={W - 1} y2={TOP}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={1}
        strokeDasharray="5 5"
      />

      {/* Cell index labels */}
      {cells.map((cell, i) => (
        <text
          key={i}
          x={1 + i * cellPx + cellPx / 2}
          y={TOP - 7}
          textAnchor="middle"
          style={{
            fill: '#000000',
            fontSize: `${Math.max(7, Math.min(10, cellPx * 0.36))}px`,
            fontFamily: 'monospace',
          }}
        >
          {cell.n}
        </text>
      ))}

      {/* Depth labels — positioned outside the dark panel body */}
      <text
        x={W - 3} y={TOP - 7}
        textAnchor="end"
        style={{ fill: '#000000', fontSize: '8px', fontFamily: 'monospace' }}
      >
        0 мм
      </text>
      <text
        x={W - 3} y={TOP + BODY_H + 12}
        textAnchor="end"
        style={{ fill: '#000000', fontSize: '8px', fontFamily: 'monospace' }}
      >
        {maxDepth.toFixed(0)} мм
      </text>

      {/* Legend */}
      <text
        x={4} y={TOP - 7}
        style={{ fill: '#000000', fontSize: '8px' }}
      >
        ячейки →
      </text>
    </svg>
  )
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false)
  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <button
        type="button"
        className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
        style={{ background: 'var(--sand)', color: 'var(--muted)', border: '1px solid var(--line)' }}
      >
        ?
      </button>
      {show && (
        <div
          className="absolute left-6 top-0 z-20 w-60 rounded-xl p-3 text-[12px] leading-relaxed shadow-premium"
          style={{ background: 'var(--cream-2)', border: '1px solid var(--line)', color: 'var(--ink)' }}
        >
          {text}
        </div>
      )}
    </div>
  )
}

function ResultRow({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className="flex justify-between py-2.5 text-[14px] border-b"
      style={{ borderColor: 'var(--line)' }}
    >
      <span style={{ color: 'var(--muted)' }}>{label}</span>
      <span
        className="font-semibold"
        style={{ color: highlight ? 'var(--accent)' : 'var(--ink)' }}
      >
        {value}
      </span>
    </div>
  )
}

function SpecRow({ item }: { item: SpecItem }) {
  return (
    <div className="flex items-baseline justify-between gap-2 text-[13px]">
      <span style={{ color: 'var(--ink)' }}>
        {item.label}{' '}
        <span className="text-[11px]" style={{ color: 'var(--muted)' }}>
          {item.dims}
        </span>
      </span>
      <span className="flex-shrink-0 font-semibold" style={{ color: 'var(--walnut)' }}>
        ×{item.qty}
      </span>
    </div>
  )
}

function FormulaRow({
  symbol,
  formula,
  desc,
}: {
  symbol: string
  formula: string
  desc: string
}) {
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b" style={{ borderColor: 'var(--line)' }}>
      <div className="flex items-baseline gap-2 flex-wrap">
        <code
          className="text-[13px] font-bold"
          style={{ fontFamily: 'monospace', color: 'var(--walnut)' }}
        >
          {symbol}
        </code>
        <code className="text-[13px]" style={{ fontFamily: 'monospace', color: 'var(--ink)' }}>
          {formula}
        </code>
      </div>
      <p className="text-[12px]" style={{ color: 'var(--muted)' }}>
        {desc}
      </p>
    </div>
  )
}

function Preset({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-3 py-1 text-[12px] transition-all"
      style={{
        borderColor: active ? 'var(--accent)' : 'var(--line)',
        background: active ? 'var(--sand)' : 'transparent',
        color: active ? 'var(--ink)' : 'var(--muted)',
      }}
    >
      {label}
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiffuserClient() {
  const [fo, setFo] = useState(500)
  const [N, setN] = useState<number>(7)
  const [c, setC] = useState(343)
  const [panelLength, setPanelLength] = useState(600)
  const [wOverride, setWOverride] = useState<number | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  const result = useMemo(() => computeQRD(fo, N, c, wOverride), [fo, N, c, wOverride])
  const spec = useMemo(
    () => buildSpec(result.cells, result.cellWidth, panelLength),
    [result, panelLength]
  )

  const diffuserProduct = products.find((p) => p.id === 'diffuser-qrd')
  const artisticProduct = products.find((p) => p.id === 'artistic-relief')

  const orderNote = `QRD-диффузор: F₀=${fo} Гц, N=${N}, ячейка W=${result.cellWidth} мм, панель ${result.totalWidth}×${panelLength}×${result.maxDepth} мм, диапазон ${result.fMin}–${result.fMax} Гц`

  return (
    <>
      <ProgressBar />
      <Header />
      <main className="pt-24">

        {/* Breadcrumb */}
        <div className="wrap py-4">
          <nav className="flex flex-wrap gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <Link href="/calculator" className="hover:text-accent">Калькулятор</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>Диффузор Шрёдера</span>
          </nav>
        </div>

        {/* ── Hero ── */}
        <section className="pad pt-8 pb-0">
          <div className="wrap">
            <RevealWrapper className="max-w-[680px] mb-14">
              <span className="eyebrow block mb-4">Инструмент проектирования</span>
              <h1
                className="text-[clamp(32px,4.5vw,58px)] font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                Калькулятор диффузора Шрёдера
              </h1>
              <p className="mt-4 text-[16px]" style={{ color: 'var(--muted)' }}>
                Рассчитайте квадратично-остаточный диффузор (QRD) для вашей комнаты.
                Настройте частоту и порядок — получите схему ячеек, спецификацию и предложение заказать панель.
              </p>
            </RevealWrapper>
          </div>
        </section>

        {/* ── Calculator ── */}
        <section className="pad pt-0">
          <div className="wrap">
            <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_460px]">

              {/* LEFT: Inputs */}
              <RevealWrapper className="flex flex-col gap-8">

                {/* F0 */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3
                      className="text-[13px] font-semibold tracking-[0.08em] uppercase"
                      style={{ color: 'var(--muted)' }}
                    >
                      Проектная частота (F₀)
                    </h3>
                    <Tooltip text="Нижняя граница рассеяния — самая низкая частота, которую панель будет эффективно рассеивать. Для домашнего кинотеатра — 400–700 Гц, для студии — 200–500 Гц." />
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <input
                      type="range" min={100} max={2000} step={50}
                      value={fo}
                      onChange={(e) => setFo(Number(e.target.value))}
                      className="flex-1"
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number" min={100} max={2000} step={50}
                        value={fo}
                        onChange={(e) =>
                          setFo(Math.max(100, Math.min(2000, Number(e.target.value) || 500)))
                        }
                        className="w-[68px] rounded-xl border px-2 py-2 text-[14px] text-center outline-none"
                        style={{
                          borderColor: 'var(--line)',
                          background: 'var(--cream-2)',
                          color: 'var(--ink)',
                        }}
                      />
                      <span className="text-[13px]" style={{ color: 'var(--muted)' }}>Гц</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[200, 300, 500, 700, 1000, 1500].map((v) => (
                      <Preset key={v} active={fo === v} onClick={() => setFo(v)} label={`${v} Гц`} />
                    ))}
                  </div>
                </div>

                {/* N */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3
                      className="text-[13px] font-semibold tracking-[0.08em] uppercase"
                      style={{ color: 'var(--muted)' }}
                    >
                      Порядок диффузора (N) — простое число
                    </h3>
                    <Tooltip text="N задаёт количество ячеек и псевдослучайную последовательность глубин. Больше N → шире диапазон и больше панель. N=7 — стандарт для большинства применений." />
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {PRIMES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setN(p)}
                        className="rounded-xl border py-3 text-center transition-all"
                        style={{
                          borderColor: N === p ? 'var(--accent)' : 'var(--line)',
                          background: N === p ? 'var(--sand)' : 'var(--cream-2)',
                          color: 'var(--ink)',
                        }}
                      >
                        <span className="text-[18px] font-semibold leading-none">{p}</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[13px]" style={{ color: 'var(--muted)' }}>
                    {PRIME_NOTES[N]}
                  </p>
                </div>

                {/* Panel length */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3
                      className="text-[13px] font-semibold tracking-[0.08em] uppercase"
                      style={{ color: 'var(--muted)' }}
                    >
                      Высота панели
                    </h3>
                    <Tooltip text="Физическая высота готовой панели (длина ячеек). Не влияет на акустику — только на материалоёмкость и внешний вид." />
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <input
                      type="range" min={300} max={2400} step={100}
                      value={panelLength}
                      onChange={(e) => setPanelLength(Number(e.target.value))}
                      className="flex-1"
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number" min={300} max={2400} step={100}
                        value={panelLength}
                        onChange={(e) =>
                          setPanelLength(
                            Math.max(300, Math.min(2400, Number(e.target.value) || 600))
                          )
                        }
                        className="w-[68px] rounded-xl border px-2 py-2 text-[14px] text-center outline-none"
                        style={{
                          borderColor: 'var(--line)',
                          background: 'var(--cream-2)',
                          color: 'var(--ink)',
                        }}
                      />
                      <span className="text-[13px]" style={{ color: 'var(--muted)' }}>мм</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[600, 900, 1200, 2400].map((v) => (
                      <Preset
                        key={v}
                        active={panelLength === v}
                        onClick={() => setPanelLength(v)}
                        label={`${v} мм`}
                      />
                    ))}
                  </div>
                </div>

                {/* Advanced */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced((s) => !s)}
                    className="flex items-center gap-2 text-[13px]"
                    style={{ color: 'var(--muted)' }}
                  >
                    <svg
                      width="11" height="11" viewBox="0 0 12 12" fill="none"
                      stroke="currentColor" strokeWidth="1.8"
                      className={`transition-transform duration-200 ${showAdvanced ? 'rotate-90' : ''}`}
                    >
                      <path d="M4 2l4 4-4 4" />
                    </svg>
                    Расширенные параметры
                  </button>

                  {showAdvanced && (
                    <div
                      className="mt-4 flex flex-col gap-5 rounded-2xl p-5"
                      style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}
                    >
                      {/* Speed of sound */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <label
                            className="text-[13px] font-semibold tracking-[0.06em] uppercase"
                            style={{ color: 'var(--muted)' }}
                          >
                            Скорость звука (c)
                          </label>
                          <Tooltip text="При 20°C = 343 м/с. При 25°C ≈ 346 м/с. Разница меньше 1% — оставьте по умолчанию." />
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="number" min={330} max={360} step={1}
                            value={c}
                            onChange={(e) =>
                              setC(Math.max(330, Math.min(360, Number(e.target.value) || 343)))
                            }
                            className="w-20 rounded-xl border px-3 py-2 text-[14px] text-center outline-none"
                            style={{ borderColor: 'var(--line)', background: 'white', color: 'var(--ink)' }}
                          />
                          <span className="text-[13px]" style={{ color: 'var(--muted)' }}>м/с</span>
                          <button
                            type="button"
                            onClick={() => setC(343)}
                            className="text-[12px] underline underline-offset-2 hover:text-accent"
                            style={{ color: 'var(--muted)' }}
                          >
                            сбросить
                          </button>
                        </div>
                      </div>

                      {/* Cell width */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <label
                            className="text-[13px] font-semibold tracking-[0.06em] uppercase"
                            style={{ color: 'var(--muted)' }}
                          >
                            Ширина ячейки (W)
                          </label>
                          <Tooltip
                            text={`Минимально необходимая ширина: ${result.unitDepth} мм. Ячейку можно сделать шире — акустика не изменится, панель станет крупнее.`}
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min={Math.ceil(result.unitDepth)}
                            max={300}
                            step={5}
                            value={wOverride ?? Math.ceil(result.unitDepth)}
                            onChange={(e) =>
                              setWOverride(
                                Math.max(
                                  Math.ceil(result.unitDepth),
                                  Number(e.target.value) || Math.ceil(result.unitDepth)
                                )
                              )
                            }
                            className="w-20 rounded-xl border px-3 py-2 text-[14px] text-center outline-none"
                            style={{ borderColor: 'var(--line)', background: 'white', color: 'var(--ink)' }}
                          />
                          <span className="text-[13px]" style={{ color: 'var(--muted)' }}>мм</span>
                          {wOverride !== null && (
                            <button
                              type="button"
                              onClick={() => setWOverride(null)}
                              className="text-[12px] underline underline-offset-2 hover:text-accent"
                              style={{ color: 'var(--muted)' }}
                            >
                              авто
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="btn btn-dark self-start"
                >
                  Заказать по этим параметрам →
                </button>
              </RevealWrapper>

              {/* RIGHT: Results (live, no button needed) */}
              <div className="flex flex-col gap-5">

                {/* SVG cross-section */}
                <RevealWrapper delay={100}>
                  <div
                    className="rounded-2xl overflow-hidden p-5"
                    style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}
                  >
                    <h3
                      className="text-[17px] font-semibold mb-4"
                      style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
                    >
                      Поперечный разрез
                    </h3>
                    <DiffuserSVG cells={result.cells} maxDepth={result.maxDepth} />
                    <p className="mt-2 text-[11px] text-center" style={{ color: 'var(--muted)' }}>
                      Ячейки 0–{N - 1} · глубина от 0 до {result.maxDepth} мм ·
                      обновляется мгновенно
                    </p>
                  </div>
                </RevealWrapper>

                {/* Dimensions */}
                <RevealWrapper delay={140}>
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}
                  >
                    <h3
                      className="text-[17px] font-semibold mb-3"
                      style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
                    >
                      Параметры панели
                    </h3>
                    <ResultRow label="Ширина ячейки W" value={`${result.cellWidth} мм`} />
                    <ResultRow
                      label={`Ширина панели (${N}×W)`}
                      value={`${result.totalWidth} мм`}
                    />
                    <ResultRow label="Высота панели" value={`${panelLength} мм`} />
                    <ResultRow
                      label="Максимальная глубина"
                      value={`${result.maxDepth} мм`}
                    />
                    <ResultRow
                      label="Единичная глубина s"
                      value={`${result.unitDepth} мм`}
                    />
                    <ResultRow
                      label="Диапазон рассеяния"
                      value={`${result.fMin}–${result.fMax} Гц`}
                      highlight
                    />
                  </div>
                </RevealWrapper>

                {/* Cells table */}
                <RevealWrapper delay={180}>
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}
                  >
                    <h3
                      className="text-[17px] font-semibold mb-3"
                      style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
                    >
                      Последовательность ячеек
                    </h3>
                    <div
                      className="grid py-2 border-b text-[11px] font-semibold tracking-[0.06em] uppercase"
                      style={{
                        gridTemplateColumns: '28px 36px 64px 1fr',
                        borderColor: 'var(--line)',
                        color: 'var(--muted)',
                      }}
                    >
                      <span>n</span>
                      <span>n²%N</span>
                      <span>глубина</span>
                      <span>масштаб</span>
                    </div>
                    {result.cells.map((cell) => (
                      <div
                        key={cell.n}
                        className="grid items-center py-2 border-b text-[13px]"
                        style={{
                          gridTemplateColumns: '28px 36px 64px 1fr',
                          borderColor: 'var(--line)',
                        }}
                      >
                        <span style={{ color: 'var(--muted)' }}>{cell.n}</span>
                        <span className="font-semibold" style={{ color: 'var(--ink)' }}>
                          {cell.residue}
                        </span>
                        <span className="font-medium" style={{ color: 'var(--walnut)' }}>
                          {cell.depth} мм
                        </span>
                        <div
                          className="h-1.5 rounded-full overflow-hidden"
                          style={{ background: 'var(--sand)' }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width:
                                result.maxDepth > 0
                                  ? `${(cell.depth / result.maxDepth) * 100}%`
                                  : '0%',
                              background: 'var(--walnut)',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </RevealWrapper>
              </div>
            </div>
          </div>
        </section>

        {/* ── Shop integration ── */}
        <section
          className="pad border-t"
          style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}
        >
          <div className="wrap">
            <RevealWrapper className="max-w-[560px] mb-12">
              <span className="eyebrow block mb-4">Следующий шаг</span>
              <h2
                className="text-[clamp(28px,3.5vw,44px)] font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
              >
                Что делать с расчётом?
              </h2>
            </RevealWrapper>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* DIY */}
              <RevealWrapper>
                <div
                  className="flex h-full flex-col rounded-2xl border p-7"
                  style={{ background: 'var(--cream)', borderColor: 'var(--line)' }}
                >
                  <div className="text-[32px] mb-4">🪚</div>
                  <h3
                    className="text-[22px] font-semibold mb-3"
                    style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
                  >
                    Сделать самостоятельно
                  </h3>
                  <p className="text-[14px] mb-6 flex-1" style={{ color: 'var(--muted)' }}>
                    Распечатайте таблицу ячеек и закупите материалы на строительном рынке.
                    Понадобятся: пиломатериалы, столярный клей ПВА, пила или фрезер.
                  </p>
                  <div
                    className="rounded-xl p-4 mb-5"
                    style={{ background: 'var(--sand)' }}
                  >
                    <p
                      className="text-[11px] font-semibold tracking-[0.06em] uppercase mb-3"
                      style={{ color: 'var(--muted)' }}
                    >
                      Спецификация материалов
                    </p>
                    <div className="flex flex-col gap-2">
                      <SpecRow item={spec.backing} />
                      <SpecRow item={spec.dividers} />
                      {spec.fillers.map((f, i) => (
                        <SpecRow key={i} item={f} />
                      ))}
                    </div>
                  </div>
                  <div
                    className="rounded-xl border px-4 py-3 text-[13px]"
                    style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                  >
                    Сложно делать самому? Закажите панель по этим параметрам у нас →
                  </div>
                </div>
              </RevealWrapper>

              {/* Order */}
              <RevealWrapper delay={100}>
                <div
                  className="flex h-full flex-col rounded-2xl p-7"
                  style={{ background: 'var(--walnut)' }}
                >
                  <div className="text-[32px] mb-4">🎯</div>
                  <h3
                    className="text-[22px] font-semibold mb-3"
                    style={{ fontFamily: 'var(--font-cormorant)', color: 'white' }}
                  >
                    Заказать у нас
                  </h3>
                  <p className="text-[14px] mb-5 flex-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Производим QRD-диффузоры под расчёт: точно по вашей частоте и размерам,
                    с отделкой шпоном или покраской.
                  </p>

                  {/* Summary */}
                  <div
                    className="rounded-xl p-4 mb-5"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    {[
                      { label: 'F₀', value: `${fo} Гц` },
                      { label: 'Порядок N', value: String(N) },
                      { label: 'Ячейка W', value: `${result.cellWidth} мм` },
                      {
                        label: 'Размер',
                        value: `${result.totalWidth}×${panelLength}×${result.maxDepth} мм`,
                      },
                      { label: 'Диапазон', value: `${result.fMin}–${result.fMax} Гц` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between py-1 text-[13px]">
                        <span style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                        <span className="font-semibold text-white">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setContactOpen(true)}
                      className="w-full rounded-xl py-3.5 text-[14px] font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                      style={{ background: 'white', color: 'var(--walnut)' }}
                    >
                      Заказать по расчёту →
                    </button>
                    {diffuserProduct && (
                      <Link
                        href={`/catalog/${diffuserProduct.category}/${diffuserProduct.slug}`}
                        className="w-full rounded-xl border py-2.5 text-[13px] font-medium text-center transition-all hover:bg-white/10"
                        style={{
                          borderColor: 'rgba(255,255,255,0.2)',
                          color: 'rgba(255,255,255,0.65)',
                        }}
                      >
                        Готовые QRD-диффузоры
                      </Link>
                    )}
                    {artisticProduct && (
                      <Link
                        href={`/catalog/${artisticProduct.category}/${artisticProduct.slug}`}
                        className="w-full rounded-xl border py-2.5 text-[13px] font-medium text-center transition-all hover:bg-white/10"
                        style={{
                          borderColor: 'rgba(255,255,255,0.2)',
                          color: 'rgba(255,255,255,0.65)',
                        }}
                      >
                        Художественные QRD-панели
                      </Link>
                    )}
                  </div>
                </div>
              </RevealWrapper>
            </div>
          </div>
        </section>

        {/* ── Physics ── */}
        <section className="pad border-t" style={{ borderColor: 'var(--line)' }}>
          <div className="wrap">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
              <RevealWrapper>
                <span className="eyebrow block mb-4">О методе</span>
                <h2
                  className="text-[clamp(24px,3vw,40px)] font-semibold mb-6 leading-tight"
                  style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
                >
                  Как работает диффузор Шрёдера
                </h2>
                <div
                  className="flex flex-col gap-4 text-[15px] leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  <p>
                    Квадратично-остаточный диффузор (QRD) изобрёл Манфред Шрёдер в 1975 году.
                    Панель превращает плоское зеркальное отражение в равномерное рассеяние по всей полусфере.
                  </p>
                  <p>
                    Ячейки разной глубины создают псевдослучайные фазовые задержки.
                    Отражённые волны интерферируют деструктивно в зеркальном направлении — вместо
                    «гулкого эха» вы слышите живое, объёмное звучание.
                  </p>
                  <p>
                    Последовательность глубин задаётся квадратичными вычетами по простому модулю N.
                    Именно простое число гарантирует, что все N глубин различны.
                  </p>
                </div>
              </RevealWrapper>

              <RevealWrapper delay={100}>
                <div
                  className="rounded-2xl p-7 h-full"
                  style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}
                >
                  <h3
                    className="text-[20px] font-semibold mb-5"
                    style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
                  >
                    Формулы расчёта
                  </h3>
                  <FormulaRow
                    symbol="d(n)"
                    formula="= (n² mod N) × c / (2·N·F₀)"
                    desc="Глубина n-й ячейки (мм)"
                  />
                  <FormulaRow
                    symbol="W_min"
                    formula="= c / (2·N·F₀)"
                    desc="Минимальная ширина ячейки"
                  />
                  <FormulaRow
                    symbol="F_max"
                    formula="≈ N × F₀"
                    desc="Верхняя граница эффективного рассеяния"
                  />
                  <FormulaRow
                    symbol="N"
                    formula="— простое число"
                    desc="Количество ячеек и тип последовательности"
                  />
                  <FormulaRow
                    symbol="c"
                    formula="= 343 м/с при 20°C"
                    desc="Скорость звука в воздухе"
                  />
                </div>
              </RevealWrapper>
            </div>
          </div>
        </section>

        {/* ── Cross-link ── */}
        <section
          className="pad border-t"
          style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}
        >
          <div className="wrap text-center">
            <RevealWrapper>
              <p className="text-[15px] mb-5" style={{ color: 'var(--muted)' }}>
                Хотите оценить бюджет на акустическую обработку всей комнаты?
              </p>
              <Link href="/calculator" className="btn btn-dark inline-flex">
                Калькулятор стоимости →
              </Link>
            </RevealWrapper>
          </div>
        </section>

      </main>
      <Footer />
      <BackToTop />
      <FloatingContact />

      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Заказать диффузор по расчёту"
        size="lg"
      >
        <ContactForm
          onSuccess={() => setContactOpen(false)}
          defaultComment={orderNote}
        />
      </Modal>
    </>
  )
}
