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

// ─── Types ────────────────────────────────────────────────────────────────────

interface SkylineCell {
  level: number   // 0..N-1
  height: number  // mm
}

interface SkylineResult {
  grid: SkylineCell[][]
  cellsW: number
  cellsH: number
  actualWidth: number
  actualHeight: number
  maxH: number
  minH: number
  avgH: number
  area: number
  totalCells: number
  levelCounts: { level: number; height: number; count: number }[]
  volumeCm3: number
  weightKg: number | undefined
  fMin: number
  fMax: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIMES = [5, 7, 11, 13] as const
type PrimeN = (typeof PRIMES)[number]

const CELL_SIZES = [40, 50, 60, 75, 100, 120]

const MATERIALS = [
  { value: 'none',  label: 'Не указан', density: 0 },
  { value: 'mdf',   label: 'МДФ',       density: 750 },
  { value: 'pine',  label: 'Сосна',     density: 500 },
  { value: 'oak',   label: 'Дуб',       density: 700 },
  { value: 'birch', label: 'Берёза',    density: 640 },
]

const PRESETS: {
  label: string; surfaceW: number; surfaceH: number
  cellSize: number; maxDepth: number; N: PrimeN
}[] = [
  { label: 'Домашняя студия',      surfaceW: 1200, surfaceH: 900,  cellSize: 60,  maxDepth: 200, N: 7  },
  { label: 'Контрольная комната',  surfaceW: 1800, surfaceH: 1200, cellSize: 75,  maxDepth: 250, N: 11 },
  { label: 'Домашний кинотеатр',   surfaceW: 2400, surfaceH: 1200, cellSize: 100, maxDepth: 180, N: 7  },
  { label: 'Музыкальная комната',  surfaceW: 1500, surfaceH: 1000, cellSize: 75,  maxDepth: 220, N: 13 },
]

// ─── QRD computation ──────────────────────────────────────────────────────────

function computeSkyline(
  surfaceW: number, surfaceH: number,
  cellSize: number, maxDepth: number,
  N: number, material: string
): SkylineResult {
  const cellsW = Math.max(1, Math.floor(surfaceW / cellSize))
  const cellsH = Math.max(1, Math.floor(surfaceH / cellSize))
  const actualWidth  = cellsW * cellSize
  const actualHeight = cellsH * cellSize
  const totalCells   = cellsW * cellsH

  // 1D quadratic residue sequence
  const qr = Array.from({ length: N }, (_, k) => (k * k) % N)
  const unitDepth = N > 1 ? maxDepth / (N - 1) : maxDepth

  // 2D Skyline grid: level = (qr[m%N] + qr[n%N]) % N
  const grid: SkylineCell[][] = Array.from({ length: cellsH }, (_, m) =>
    Array.from({ length: cellsW }, (_, n) => {
      const level = (qr[m % N] + qr[n % N]) % N
      const height = Math.round(level * unitDepth)
      return { level, height }
    })
  )

  const flat = grid.flat()
  const heights = flat.map(c => c.height)
  const maxH = Math.max(...heights)
  const minH = Math.min(...heights)
  const avgH = Math.round(heights.reduce((a, b) => a + b, 0) / totalCells)

  // Level counts
  const countMap = new Map<number, number>()
  flat.forEach(c => countMap.set(c.level, (countMap.get(c.level) ?? 0) + 1))
  const levelCounts = Array.from(countMap.entries())
    .map(([level, count]) => ({ level, height: Math.round(level * unitDepth), count }))
    .sort((a, b) => a.level - b.level)

  // Volume & weight
  const volumeMm3 = flat.reduce((sum, c) => sum + c.height * cellSize * cellSize, 0)
  const volumeCm3 = Math.round(volumeMm3 / 1000)
  const mat = MATERIALS.find(m => m.value === material)
  const weightKg = mat && mat.density > 0
    ? Math.round((volumeMm3 / 1e9) * mat.density * 100) / 100
    : undefined

  // Frequency range
  const fMin = maxDepth > 0 ? Math.round(343000 / (4 * maxDepth)) : 0
  const fMax = cellSize > 0 ? Math.round(343000 / (2 * cellSize)) : 0

  const area = Math.round(actualWidth * actualHeight / 1e6 * 100) / 100

  return {
    grid, cellsW, cellsH, actualWidth, actualHeight,
    maxH, minH, avgH, area, totalCells, levelCounts,
    volumeCm3, weightKg, fMin, fMax,
  }
}

// ─── Color helpers ─────────────────────────────────────────────────────────────

function levelColor(level: number, N: number): string {
  const t = N <= 1 ? 0 : level / (N - 1)
  const r = Math.round(0xEF - t * (0xEF - 0x7A))
  const g = Math.round(0xE8 - t * (0xE8 - 0x5A))
  const b = Math.round(0xDC - t * (0xDC - 0x3A))
  return `rgb(${r},${g},${b})`
}

// ─── 2D Grid ──────────────────────────────────────────────────────────────────

function Grid2D({ grid, N }: { grid: SkylineCell[][]; N: number }) {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  const DR = Math.min(rows, 60)
  const DC = Math.min(cols, 60)
  const px = Math.max(3, Math.min(18, Math.floor(360 / Math.max(DR, DC))))
  // Show depth labels only when cells are large enough to fit 2-3 digit numbers
  const showLabels = px >= 14
  const fontSize = Math.min(8, Math.floor(px * 0.48))

  return (
    <div>
      <svg width={DC * px} height={DR * px} className="block" style={{ maxWidth: '100%' }}>
        {/* Background rects */}
        {grid.slice(0, DR).map((row, m) =>
          row.slice(0, DC).map((cell, n) => (
            <rect
              key={`r-${m}-${n}`}
              x={n * px} y={m * px}
              width={px - 0.5} height={px - 0.5}
              fill={levelColor(cell.level, N)}
            />
          ))
        )}
        {/* Depth labels — only when cells are big enough */}
        {showLabels && grid.slice(0, DR).map((row, m) =>
          row.slice(0, DC).map((cell, n) => (
            <text
              key={`t-${m}-${n}`}
              x={n * px + px * 0.5}
              y={m * px + px * 0.5}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={fontSize}
              fontFamily="monospace"
              fontWeight="600"
              fill={cell.level < Math.ceil(N / 2) ? 'rgba(245,228,205,0.92)' : 'rgba(65,42,22,0.78)'}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {cell.height}
            </text>
          ))
        )}
      </svg>
      {(rows > 60 || cols > 60) && (
        <p className="mt-1 text-[11px]" style={{ color: 'var(--muted)' }}>
          Показаны первые {DC}×{DR} из {cols}×{rows} ячеек
        </p>
      )}
      {!showLabels && (
        <p className="mt-1 text-[11px]" style={{ color: 'var(--muted)' }}>
          Подписи скрыты — слишком много ячеек. Уменьшите размер панели или увеличьте ячейку чтобы увидеть глубины.
        </p>
      )}
    </div>
  )
}

// ─── 3D Isometric preview ─────────────────────────────────────────────────────

function Grid3D({ grid, N, maxDepth }: { grid: SkylineCell[][]; N: number; maxDepth: number }) {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  const DR = Math.min(rows, 18)
  const DC = Math.min(cols, 18)

  const hw  = Math.max(7, Math.min(20, Math.floor(220 / Math.max(DR, DC))))
  const hh  = hw / 2
  const maxHpx = Math.min(hw * 3, 80)

  const W = (DC + DR) * hw + hw * 4
  const H = (DC + DR) * hh + maxHpx + hh * 4
  const ox = DR * hw + hw * 2     // x origin (grid 0,0 base)
  const oy = maxHpx + hh * 2      // y origin (ground level)

  // Painter's order: back to front (ascending m+n)
  const cells: { m: number; n: number; cell: SkylineCell }[] = []
  for (let m = 0; m < DR; m++)
    for (let n = 0; n < DC; n++)
      cells.push({ m, n, cell: grid[m][n] })
  cells.sort((a, b) => (a.m + a.n) - (b.m + b.n))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 280 }}>
      {cells.map(({ m, n, cell }) => {
        const t   = N <= 1 ? 0 : cell.level / (N - 1)
        const hp  = maxDepth > 0 ? (cell.height / maxDepth) * maxHpx : 0
        const cx  = ox + (n - m) * hw
        const bY  = oy + (n + m) * hh   // base ground Y
        const tY  = bY - hp              // top face center Y

        // Top face diamond
        const vtTop    = `${cx},${tY - hh}`
        const vtRight  = `${cx + hw},${tY}`
        const vtBottom = `${cx},${tY + hh}`
        const vtLeft   = `${cx - hw},${tY}`

        // Ground corners
        const vgRight  = `${cx + hw},${bY}`
        const vgBottom = `${cx},${bY + hh}`
        const vgLeft   = `${cx - hw},${bY}`

        const r0 = Math.round(0xEF - t * (0xEF - 0x7A))
        const g0 = Math.round(0xE8 - t * (0xE8 - 0x5A))
        const b0 = Math.round(0xDC - t * (0xDC - 0x3A))
        const topC   = `rgb(${r0},${g0},${b0})`
        const rightC = `rgb(${Math.round(r0 * .65)},${Math.round(g0 * .65)},${Math.round(b0 * .65)})`
        const leftC  = `rgb(${Math.round(r0 * .48)},${Math.round(g0 * .48)},${Math.round(b0 * .48)})`

        return (
          <g key={`${m}-${n}`}>
            {hp > 0.5 && (
              <>
                <polygon points={`${vtRight} ${vtBottom} ${vgBottom} ${vgRight}`} fill={rightC} />
                <polygon points={`${vtLeft} ${vtBottom} ${vgBottom} ${vgLeft}`}  fill={leftC} />
              </>
            )}
            <polygon
              points={`${vtTop} ${vtRight} ${vtBottom} ${vtLeft}`}
              fill={topC}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={0.5}
            />
          </g>
        )
      })}
    </svg>
  )
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <button
        type="button"
        className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
        style={{ background: 'var(--sand)', color: 'var(--muted)', border: '1px solid var(--line)' }}
      >?</button>
      {show && (
        <div
          className="absolute left-6 top-0 z-20 w-60 rounded-xl p-3 text-[12px] leading-relaxed shadow-premium"
          style={{ background: 'var(--cream-2)', border: '1px solid var(--line)', color: 'var(--ink)' }}
        >{text}</div>
      )}
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--cream)', border: '1px solid var(--line)' }}>
      <p className="text-[11px] tracking-[0.07em] uppercase mb-1" style={{ color: 'var(--muted)' }}>{label}</p>
      <p className="text-[20px] font-semibold leading-tight" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>{value}</p>
      {sub && <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>{sub}</p>}
    </div>
  )
}

// Dimension input — commits on blur/Enter, remounts cleanly on preset/unit change
function DimInput({
  label, valueMm, onChangeMm, unit, tip,
}: {
  label: string; valueMm: number; onChangeMm: (v: number) => void; unit: 'mm' | 'cm'; tip: string
}) {
  const displayVal = unit === 'cm' ? valueMm / 10 : valueMm

  const commit = (raw: string) => {
    const n = parseFloat(raw)
    if (isNaN(n) || n <= 0) return
    const mm = unit === 'cm' ? Math.round(n * 10) : Math.round(n)
    onChangeMm(Math.max(50, Math.min(6000, mm)))
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <p className="text-[12px] font-semibold tracking-[0.07em] uppercase" style={{ color: 'var(--muted)' }}>{label}</p>
        <Tooltip text={tip} />
      </div>
      <div className="flex items-center gap-2">
        <input
          key={displayVal + unit}
          type="number"
          defaultValue={displayVal}
          min={unit === 'mm' ? 50 : 5}
          max={unit === 'mm' ? 6000 : 600}
          step={unit === 'mm' ? 10 : 1}
          onBlur={e => commit(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && commit((e.target as HTMLInputElement).value)}
          className="w-full rounded-xl border px-3 py-2.5 text-[14px] outline-none transition-all focus:border-[var(--accent)]"
          style={{ borderColor: 'var(--line)', background: 'var(--cream-2)', color: 'var(--ink)' }}
        />
        <span className="text-[13px] flex-shrink-0" style={{ color: 'var(--muted)' }}>{unit}</span>
      </div>
    </div>
  )
}

// ─── Export helpers ───────────────────────────────────────────────────────────

function buildCSV(result: SkylineResult, cellSize: number): string {
  const header = 'Уровень,Высота (мм),Размер блока,Количество шт.,Доля %\n'
  const rows = result.levelCounts.map(lc =>
    `${lc.level},${lc.height},${cellSize}x${cellSize}x${lc.height} мм,${lc.count},${Math.round(lc.count / result.totalCells * 100)}`
  ).join('\n')
  const footer = [
    '',
    `Итого блоков,${result.totalCells}`,
    `Площадь панели,${result.area} м²`,
    `Объём материала,${result.volumeCm3} см³`,
    result.weightKg ? `Ориентировочный вес,${result.weightKg} кг` : '',
    `Рабочий диапазон,${result.fMin}–${result.fMax} Гц`,
  ].filter(Boolean).join('\n')
  return header + rows + '\n' + footer
}

function buildClipboard(result: SkylineResult, cellSize: number): string {
  return [
    'SKYLINE-ДИФФУЗОР — спецификация',
    `Размер панели: ${result.actualWidth}×${result.actualHeight} мм`,
    `Размер ячейки: ${cellSize}×${cellSize} мм`,
    `Сетка: ${result.cellsW}×${result.cellsH} = ${result.totalCells} блоков`,
    `Диапазон рассеяния: ${result.fMin}–${result.fMax} Гц`,
    '',
    'Таблица раскроя:',
    ...result.levelCounts.map(lc => `  h=${lc.height} мм — ${lc.count} шт. (${Math.round(lc.count / result.totalCells * 100)}%)`),
    '',
    `Объём материала: ${result.volumeCm3} см³`,
    result.weightKg ? `Вес: ≈${result.weightKg} кг` : '',
  ].filter(s => s !== undefined && !(s === '' && false)).join('\n')
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SkylineClient() {
  const [unit,       setUnit]       = useState<'mm' | 'cm'>('mm')
  const [surfaceW,   setSurfaceW]   = useState(1200)
  const [surfaceH,   setSurfaceH]   = useState(900)
  const [cellSize,   setCellSize]   = useState(60)
  const [maxDepth,   setMaxDepth]   = useState(200)
  const [N,          setN]          = useState<PrimeN>(7)
  const [material,   setMaterial]   = useState('none')
  const [preset,     setPreset]     = useState<number | null>(0)
  const [contactOpen,setContactOpen]= useState(false)
  const [copied,     setCopied]     = useState(false)

  const result = useMemo(
    () => computeSkyline(surfaceW, surfaceH, cellSize, maxDepth, N, material),
    [surfaceW, surfaceH, cellSize, maxDepth, N, material]
  )

  // Warnings
  const warns: string[] = []
  if (result.cellsW < N || result.cellsH < N)
    warns.push(`Для полного паттерна нужно хотя бы ${N}×${N} ячеек. Текущая сетка: ${result.cellsW}×${result.cellsH}.`)
  if (result.totalCells < 4)
    warns.push('Слишком мало ячеек — увеличьте поверхность или уменьшите размер ячейки.')
  if (maxDepth > Math.min(surfaceW, surfaceH) * 0.35)
    warns.push('Глубина более 35% наименьшей стороны — проверьте монтажные ограничения.')

  const applyPreset = (i: number) => {
    const p = PRESETS[i]
    setPreset(i)
    if (unit === 'mm') {
      setSurfaceW(p.surfaceW); setSurfaceH(p.surfaceH)
    } else {
      setSurfaceW(p.surfaceW); setSurfaceH(p.surfaceH) // always store mm
    }
    setCellSize(p.cellSize); setMaxDepth(p.maxDepth); setN(p.N)
  }

  const touch = (fn: () => void) => { setPreset(null); fn() }

  const handleCSV = () => {
    const csv  = buildCSV(result, cellSize)
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'skyline-spec.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildClipboard(result, cellSize))
    setCopied(true); setTimeout(() => setCopied(false), 2200)
  }

  const orderNote = `Skyline-диффузор: панель ${result.actualWidth}×${result.actualHeight} мм, ячейка ${cellSize}×${cellSize} мм, глубина до ${maxDepth} мм, ${result.totalCells} блоков, диапазон ${result.fMin}–${result.fMax} Гц`

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
            <span style={{ color: 'var(--ink)' }}>Skyline-диффузор</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="pad pt-8 pb-0">
          <div className="wrap">
            <RevealWrapper className="max-w-[700px] mb-12">
              <span className="eyebrow block mb-4">Инструмент проектирования</span>
              <h1
                className="text-[clamp(32px,4.5vw,58px)] font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                Калькулятор диффузора Skyline
              </h1>
              <p className="mt-4 text-[16px]" style={{ color: 'var(--muted)' }}>
                2D квадратично-остаточный диффузор: задайте размеры поверхности и ячейки — получите
                карту глубин, 3D-превью, таблицу раскроя и спецификацию для заказа или самостоятельного
                изготовления.
              </p>
            </RevealWrapper>
          </div>
        </section>

        {/* Calculator */}
        <section className="pad pt-0">
          <div className="wrap">

            {/* Presets */}
            <RevealWrapper className="mb-10">
              <p className="text-[12px] font-semibold tracking-[0.08em] uppercase mb-3" style={{ color: 'var(--muted)' }}>
                Готовые пресеты
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p, i) => (
                  <button
                    key={i} type="button"
                    onClick={() => applyPreset(i)}
                    className="rounded-full border px-4 py-1.5 text-[13px] transition-all"
                    style={{
                      borderColor: preset === i ? 'var(--accent)' : 'var(--line)',
                      background:  preset === i ? 'var(--sand)' : 'transparent',
                      color:       preset === i ? 'var(--ink)' : 'var(--muted)',
                    }}
                  >{p.label}</button>
                ))}
              </div>
            </RevealWrapper>

            <div className="grid grid-cols-1 gap-12 xl:grid-cols-[1fr_460px]">

              {/* ── LEFT: Inputs ── */}
              <RevealWrapper className="flex flex-col gap-8">

                {/* Units */}
                <div>
                  <p className="text-[12px] font-semibold tracking-[0.08em] uppercase mb-3" style={{ color: 'var(--muted)' }}>
                    Единицы измерения
                  </p>
                  <div className="flex gap-2">
                    {(['mm', 'cm'] as const).map(u => (
                      <button
                        key={u} type="button"
                        onClick={() => setUnit(u)}
                        className="rounded-xl border px-5 py-2 text-[14px] font-semibold transition-all"
                        style={{
                          borderColor: unit === u ? 'var(--accent)' : 'var(--line)',
                          background:  unit === u ? 'var(--sand)' : 'var(--cream-2)',
                          color: 'var(--ink)',
                        }}
                      >{u === 'mm' ? 'мм' : 'см'}</button>
                    ))}
                  </div>
                </div>

                {/* Surface W × H */}
                <div className="grid grid-cols-2 gap-4">
                  <DimInput
                    label="Ширина поверхности"
                    valueMm={surfaceW}
                    onChangeMm={v => touch(() => setSurfaceW(v))}
                    unit={unit}
                    tip="Горизонтальный размер панели. Фактический размер будет кратен размеру ячейки."
                  />
                  <DimInput
                    label="Высота поверхности"
                    valueMm={surfaceH}
                    onChangeMm={v => touch(() => setSurfaceH(v))}
                    unit={unit}
                    tip="Вертикальный размер панели."
                  />
                </div>

                {/* Cell size */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-[12px] font-semibold tracking-[0.08em] uppercase" style={{ color: 'var(--muted)' }}>Размер ячейки</p>
                    <Tooltip text="Сторона одного квадратного блока. Меньше ячейка — выше рабочая частота. Для студий рекомендуют 50–75 мм." />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CELL_SIZES.map(s => (
                      <button
                        key={s} type="button"
                        onClick={() => touch(() => setCellSize(s))}
                        className="rounded-xl border px-4 py-2 text-[13px] font-semibold transition-all"
                        style={{
                          borderColor: cellSize === s ? 'var(--accent)' : 'var(--line)',
                          background:  cellSize === s ? 'var(--sand)' : 'var(--cream-2)',
                          color: 'var(--ink)',
                        }}
                      >{unit === 'mm' ? `${s} мм` : `${s / 10} см`}</button>
                    ))}
                  </div>
                </div>

                {/* Max depth */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-[12px] font-semibold tracking-[0.08em] uppercase" style={{ color: 'var(--muted)' }}>
                      Макс. глубина: {unit === 'mm' ? `${maxDepth} мм` : `${maxDepth / 10} см`}
                    </p>
                    <Tooltip text="Высота самого высокого блока. Чем глубже — тем ниже нижняя рабочая частота диффузора." />
                  </div>
                  <input
                    type="range" min={30} max={500} step={10} value={maxDepth}
                    onChange={e => touch(() => setMaxDepth(Number(e.target.value)))}
                    className="w-full" style={{ accentColor: 'var(--accent)' }}
                  />
                  <div className="flex justify-between text-[11px] mt-1" style={{ color: 'var(--muted)' }}>
                    <span>{unit === 'mm' ? '30 мм' : '3 см'}</span>
                    <span>{unit === 'mm' ? '500 мм' : '50 см'}</span>
                  </div>
                </div>

                {/* Prime N */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-[12px] font-semibold tracking-[0.08em] uppercase" style={{ color: 'var(--muted)' }}>Порядок паттерна (N)</p>
                    <Tooltip text="Простое число N задаёт количество уровней высот и сложность паттерна. N=7 — стандарт для большинства случаев." />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {PRIMES.map(p => (
                      <button
                        key={p} type="button"
                        onClick={() => touch(() => setN(p))}
                        className="rounded-xl border py-3 text-center transition-all"
                        style={{
                          borderColor: N === p ? 'var(--accent)' : 'var(--line)',
                          background:  N === p ? 'var(--sand)' : 'var(--cream-2)',
                          color: 'var(--ink)',
                        }}
                      >
                        <span className="text-[20px] font-semibold leading-none">{p}</span>
                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>{p} уровней</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-[12px] font-semibold tracking-[0.08em] uppercase" style={{ color: 'var(--muted)' }}>Материал</p>
                    <Tooltip text="Используется для расчёта веса готовой панели. МДФ — наиболее распространённый вариант." />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {MATERIALS.map(m => (
                      <button
                        key={m.value} type="button"
                        onClick={() => touch(() => setMaterial(m.value))}
                        className="rounded-xl border px-4 py-2 text-[13px] transition-all"
                        style={{
                          borderColor: material === m.value ? 'var(--accent)' : 'var(--line)',
                          background:  material === m.value ? 'var(--sand)' : 'var(--cream-2)',
                          color: 'var(--ink)',
                        }}
                      >{m.label}</button>
                    ))}
                  </div>
                </div>

                <button type="button" onClick={() => setContactOpen(true)} className="btn btn-dark self-start">
                  Заказать по параметрам →
                </button>
              </RevealWrapper>

              {/* ── RIGHT: Live results ── */}
              <div className="flex flex-col gap-5">

                {/* Warnings */}
                {warns.length > 0 && (
                  <RevealWrapper>
                    <div className="rounded-xl p-4 flex flex-col gap-1.5" style={{ background: '#FFFBEB', border: '1px solid #F0C040' }}>
                      {warns.map((w, i) => (
                        <p key={i} className="text-[13px]" style={{ color: '#7A5A00' }}>⚠ {w}</p>
                      ))}
                    </div>
                  </RevealWrapper>
                )}

                {/* Frequency range */}
                <RevealWrapper delay={60}>
                  <div className="rounded-2xl p-5" style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                    <h3 className="text-[16px] font-semibold mb-3" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                      Рабочий диапазон
                    </h3>
                    <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: 'var(--sand)' }}>
                      <div className="h-full rounded-full" style={{ background: 'var(--accent)', width: '100%' }} />
                    </div>
                    <div className="flex justify-between text-[13px] font-semibold" style={{ color: 'var(--ink)' }}>
                      <span>{result.fMin} Гц</span>
                      <span>{result.fMax > 20000 ? '>20 кГц' : `${result.fMax} Гц`}</span>
                    </div>
                    <p className="mt-1 text-[12px]" style={{ color: 'var(--muted)' }}>
                      Эффективное рассеяние от {result.fMin} до {result.fMax > 20000 ? '20 000' : result.fMax} Гц
                    </p>
                  </div>
                </RevealWrapper>

                {/* Grid params */}
                <RevealWrapper delay={100}>
                  <div className="rounded-2xl p-5" style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                    <h3 className="text-[16px] font-semibold mb-4" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                      Параметры сетки
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <StatCard label="Сетка ячеек"   value={`${result.cellsW}×${result.cellsH}`}       sub="колонки × строки" />
                      <StatCard label="Всего блоков"   value={`${result.totalCells} шт.`} />
                      <StatCard label="Фактическая ширина"  value={`${result.actualWidth} мм`} />
                      <StatCard label="Фактическая высота"  value={`${result.actualHeight} мм`} />
                      <StatCard label="Площадь панели" value={`${result.area} м²`} />
                      <StatCard
                        label="Объём / вес"
                        value={`${result.volumeCm3} см³`}
                        sub={result.weightKg ? `≈ ${result.weightKg} кг` : 'выберите материал'}
                      />
                    </div>
                  </div>
                </RevealWrapper>

                {/* Depth stats */}
                <RevealWrapper delay={140}>
                  <div className="rounded-2xl p-5" style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                    <h3 className="text-[16px] font-semibold mb-3" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                      Статистика глубин
                    </h3>
                    {[
                      { l: 'Максимальная', v: `${result.maxH} мм` },
                      { l: 'Минимальная',  v: `${result.minH} мм` },
                      { l: 'Средняя',      v: `${result.avgH} мм` },
                    ].map(({ l, v }) => (
                      <div key={l} className="flex justify-between py-2 text-[14px] border-b" style={{ borderColor: 'var(--line)' }}>
                        <span style={{ color: 'var(--muted)' }}>{l}</span>
                        <span className="font-semibold" style={{ color: 'var(--walnut)' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </RevealWrapper>

              </div>
            </div>

            {/* ── Visualizations ── */}
            <RevealWrapper className="mt-14">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* 2D map */}
                <div className="rounded-2xl p-5" style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                  <h3 className="text-[17px] font-semibold mb-4" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                    Карта глубин (2D)
                  </h3>
                  <Grid2D grid={result.grid} N={N} />
                  <div className="mt-3 flex items-center gap-3">
                    <div
                      className="h-2.5 flex-1 rounded-full"
                      style={{ background: 'linear-gradient(to right, rgb(239,232,220), rgb(122,90,58))' }}
                    />
                    <div className="flex justify-between text-[11px]" style={{ color: 'var(--muted)', minWidth: 90 }}>
                      <span>0 мм</span>
                      <span>{result.maxH} мм</span>
                    </div>
                  </div>
                </div>

                {/* 3D preview */}
                <div className="rounded-2xl p-5" style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                  <h3 className="text-[17px] font-semibold mb-4" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                    3D-превью (изометрия)
                  </h3>
                  <Grid3D grid={result.grid} N={N} maxDepth={maxDepth} />
                  <p className="mt-2 text-[11px] text-center" style={{ color: 'var(--muted)' }}>
                    Макс. 18×18 ячеек · обновляется мгновенно
                  </p>
                </div>

              </div>
            </RevealWrapper>

          </div>
        </section>

        {/* ── Cut list ── */}
        <section className="pad border-t" style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}>
          <div className="wrap">

            <RevealWrapper className="mb-8">
              <h2 className="text-[clamp(26px,3.5vw,42px)] font-semibold leading-tight" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                Таблица раскроя
              </h2>
              <p className="mt-2 text-[15px]" style={{ color: 'var(--muted)' }}>
                Блоки сгруппированы по высоте. Размер каждого: {cellSize}×{cellSize}×h мм.
              </p>
            </RevealWrapper>

            <RevealWrapper>
              <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid var(--line)' }}>
                <table className="w-full text-[14px]">
                  <thead>
                    <tr style={{ background: 'var(--sand)', borderBottom: '1px solid var(--line)' }}>
                      {['Уровень', 'Высота h', 'Размер блока', 'Кол-во', 'Доля'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] tracking-[0.07em] uppercase font-semibold" style={{ color: 'var(--muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.levelCounts.map((lc, i) => (
                      <tr
                        key={lc.level}
                        style={{ background: i % 2 === 0 ? 'var(--cream)' : 'var(--cream-2)', borderBottom: '1px solid var(--line)' }}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-sm flex-shrink-0" style={{ background: levelColor(lc.level, N) }} />
                            <span className="font-semibold" style={{ color: 'var(--ink)' }}>{lc.level}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 font-semibold" style={{ color: 'var(--walnut)' }}>{lc.height} мм</td>
                        <td className="px-5 py-3 text-[13px]" style={{ color: 'var(--muted)' }}>
                          {cellSize}×{cellSize}×{lc.height} мм
                        </td>
                        <td className="px-5 py-3 font-semibold" style={{ color: 'var(--ink)' }}>{lc.count} шт.</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 rounded-full overflow-hidden" style={{ background: 'var(--sand)' }}>
                              <div className="h-full rounded-full" style={{ background: 'var(--walnut)', width: `${lc.count / result.totalCells * 100}%` }} />
                            </div>
                            <span className="text-[12px]" style={{ color: 'var(--muted)' }}>
                              {Math.round(lc.count / result.totalCells * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: 'var(--sand)', borderTop: '2px solid var(--line)' }}>
                      <td colSpan={3} className="px-5 py-3 font-semibold" style={{ color: 'var(--ink)' }}>Итого</td>
                      <td className="px-5 py-3 font-bold text-[16px]" style={{ color: 'var(--walnut)' }}>{result.totalCells} шт.</td>
                      <td className="px-5 py-3 font-semibold" style={{ color: 'var(--ink)' }}>100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </RevealWrapper>

            {/* Export buttons */}
            <RevealWrapper className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={handleCSV} className="btn btn-out flex items-center gap-2 text-[13px]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5 5-5-5M12 3v12" />
                </svg>
                Скачать CSV
              </button>
              <button type="button" onClick={handleCopy} className="btn btn-out flex items-center gap-2 text-[13px]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M16 8h2a2 2 0 012 2v8a2 2 0 01-2 2H10a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                </svg>
                {copied ? '✓ Скопировано' : 'Скопировать спецификацию'}
              </button>
              <button type="button" onClick={() => window.print()} className="btn btn-out flex items-center gap-2 text-[13px]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" />
                </svg>
                Печать / PDF
              </button>
            </RevealWrapper>

          </div>
        </section>

        {/* ── Shop section ── */}
        <section className="pad border-t" style={{ borderColor: 'var(--line)' }}>
          <div className="wrap">
            <RevealWrapper className="max-w-[500px] mb-10">
              <span className="eyebrow block mb-4">Следующий шаг</span>
              <h2 className="text-[clamp(26px,3.5vw,42px)] font-semibold leading-tight" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                Что делать с расчётом?
              </h2>
            </RevealWrapper>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* DIY */}
              <RevealWrapper>
                <div className="flex h-full flex-col rounded-2xl border p-7" style={{ background: 'var(--cream)', borderColor: 'var(--line)' }}>
                  <div className="text-[32px] mb-4">🪚</div>
                  <h3 className="text-[22px] font-semibold mb-3" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                    Сделать самостоятельно
                  </h3>
                  <p className="text-[14px] mb-6 flex-1" style={{ color: 'var(--muted)' }}>
                    Скачайте CSV-спецификацию, закупите нарезанные брусья на строительном рынке
                    и соберите Skyline по таблице раскроя. Потребуются: деревянные бруски, клей ПВА,
                    основа-подложка.
                  </p>
                  <div
                    className="rounded-xl p-4"
                    style={{ background: 'var(--sand)' }}
                  >
                    <p className="text-[12px] font-semibold tracking-[0.06em] uppercase mb-2" style={{ color: 'var(--muted)' }}>
                      Что нужно
                    </p>
                    {result.levelCounts.slice(0, 5).map(lc => (
                      <p key={lc.level} className="text-[13px]" style={{ color: 'var(--ink)' }}>
                        {cellSize}×{cellSize}×{lc.height} мм — {lc.count} шт.
                      </p>
                    ))}
                    {result.levelCounts.length > 5 && (
                      <p className="text-[12px] mt-1" style={{ color: 'var(--muted)' }}>… и ещё {result.levelCounts.length - 5} типов</p>
                    )}
                  </div>
                </div>
              </RevealWrapper>

              {/* Order */}
              <RevealWrapper delay={100}>
                <div className="flex h-full flex-col rounded-2xl p-7" style={{ background: 'var(--walnut)' }}>
                  <div className="text-[32px] mb-4">🎯</div>
                  <h3 className="text-[22px] font-semibold mb-3" style={{ fontFamily: 'var(--font-cormorant)', color: 'white' }}>
                    Заказать у нас
                  </h3>
                  <p className="text-[14px] mb-5 flex-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Изготовим Skyline-диффузор под ваши параметры: нарежем блоки, соберём панель
                    с точностью до 0.1 мм, отделаем шпоном или покрасим.
                  </p>
                  <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    {[
                      { l: 'Размер',   v: `${result.actualWidth}×${result.actualHeight} мм` },
                      { l: 'Ячейка',   v: `${cellSize}×${cellSize} мм` },
                      { l: 'Блоков',   v: `${result.totalCells} шт.` },
                      { l: 'Глубина',  v: `до ${maxDepth} мм` },
                      { l: 'Диапазон', v: `${result.fMin}–${result.fMax} Гц` },
                    ].map(({ l, v }) => (
                      <div key={l} className="flex justify-between py-1 text-[13px]">
                        <span style={{ color: 'rgba(255,255,255,0.55)' }}>{l}</span>
                        <span className="font-semibold text-white">{v}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setContactOpen(true)}
                    className="w-full rounded-xl py-3.5 text-[14px] font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: 'white', color: 'var(--walnut)' }}
                  >
                    Заказать по расчёту →
                  </button>
                </div>
              </RevealWrapper>

            </div>
          </div>
        </section>

        {/* ── Cross-links ── */}
        <section className="pad border-t" style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}>
          <div className="wrap text-center">
            <RevealWrapper>
              <p className="text-[15px] mb-5" style={{ color: 'var(--muted)' }}>
                Нужен одномерный QRD-диффузор или оценка бюджета всей обработки?
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/diffuser"    className="btn btn-dark inline-flex">Калькулятор QRD →</Link>
                <Link href="/calculator"  className="btn btn-out inline-flex">Калькулятор стоимости</Link>
              </div>
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
        title="Заказать Skyline-диффузор"
        size="lg"
      >
        <ContactForm onSuccess={() => setContactOpen(false)} defaultComment={orderNote} />
      </Modal>
    </>
  )
}
