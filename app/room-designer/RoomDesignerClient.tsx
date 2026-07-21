'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
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

type PurposeId = 'home-theater' | 'studio' | 'hifi' | 'office' | 'restaurant' | 'rehearsal'
type ShapeId = 'rectangular' | 'l-shaped' | 'angled'
type WallId = 'front' | 'back' | 'left' | 'right'
type ElementType = 'absorption' | 'diffuser-qrd' | 'diffuser-skyline' | 'bass-trap'

interface Door { wall: WallId; pos: number }
interface Window { wall: WallId; pos: number; width: number }

interface RoomConfig {
  length: number
  width: number
  height: number
  purpose: PurposeId
  shape: ShapeId
  doors: Door[]
  windows: Window[]
  listenX: number  // fraction 0–1 of length (from front)
  listenY: number  // fraction 0–1 of width (from left)
}

interface PanelZone {
  wall: WallId | 'ceiling' | 'floor'
  type: ElementType
  x: number    // position along wall (m from left edge of that wall)
  y: number    // height from floor (m)
  w: number    // width (m)
  h: number    // height (m)
  label?: string
}

interface RoomResult {
  bareRT60: number
  treatedRT60: number
  targetMin: number
  targetMax: number
  volume: number
  totalSurface: number
  absArea: number
  diffQRDArea: number
  diffSkylineArea: number
  bassCorners: number
  tubeTrapCount: number
  basaltArea: number
  prdArea: number
  premiumArea: number
  listenPos: { x: number; y: number }
  speakerL: { x: number; y: number }
  speakerR: { x: number; y: number }
  leftReflX: number
  rightReflX: number
  ceilReflX: number
  ceilReflY: number
  panels: PanelZone[]
  coveragePercent: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PURPOSE_CONFIG: Record<PurposeId, {
  label: string; icon: string
  rtMin: number; rtMax: number
  absRate: number; diffRate: number; skyRate: number
  desc: string
}> = {
  'home-theater': { label: 'Домашний кинотеатр', icon: '🎬', rtMin: 0.35, rtMax: 0.45, absRate: 0.45, diffRate: 0.20, skyRate: 0.10, desc: 'EBU R68 / Dolby Atmos — 0.35–0.45 с' },
  'studio':       { label: 'Музыкальная студия',  icon: '🎙️', rtMin: 0.25, rtMax: 0.35, absRate: 0.55, diffRate: 0.18, skyRate: 0.08, desc: 'AES / EBU R107 — 0.25–0.35 с' },
  'hifi':         { label: 'Hi-Fi комната',        icon: '🎵', rtMin: 0.40, rtMax: 0.55, absRate: 0.38, diffRate: 0.22, skyRate: 0.12, desc: 'ITU-R BS.1116 — 0.40–0.55 с' },
  'office':       { label: 'Офис / переговорная',  icon: '💼', rtMin: 0.50, rtMax: 0.70, absRate: 0.32, diffRate: 0.08, skyRate: 0.04, desc: 'ISO 3382-3 — 0.50–0.70 с' },
  'restaurant':   { label: 'Ресторан / lounge',    icon: '🍽️', rtMin: 0.80, rtMax: 1.20, absRate: 0.22, diffRate: 0.06, skyRate: 0.04, desc: 'ISO 3382-2 — 0.80–1.20 с' },
  'rehearsal':    { label: 'Репетиционная база',   icon: '🥁', rtMin: 0.30, rtMax: 0.50, absRate: 0.50, diffRate: 0.16, skyRate: 0.08, desc: 'AES — 0.30–0.50 с' },
}

const ELEMENT_COLORS: Record<ElementType, string> = {
  'absorption':       '#3B82F6',
  'diffuser-qrd':     '#22C55E',
  'diffuser-skyline': '#A855F7',
  'bass-trap':        '#F97316',
}

const ELEMENT_LABELS: Record<ElementType, string> = {
  'absorption':       'Поглощение',
  'diffuser-qrd':     'QRD диффузор',
  'diffuser-skyline': 'Skyline диффузор',
  'bass-trap':        'Басовая ловушка',
}

const BARE_ALPHA = 0.05

// ─── Acoustic computation ─────────────────────────────────────────────────────

function roundTo5(x: number) { return Math.round(x / 5) * 5 }
function sabine(V: number, A: number) { return 0.161 * V / Math.max(A, 0.01) }

function computeRoom(cfg: RoomConfig): RoomResult {
  const { length: L, width: W, height: H, purpose } = cfg
  const pc = PURPOSE_CONFIG[purpose]

  const V = L * W * H
  const floorArea = L * W
  const frontArea = W * H
  const backArea  = W * H
  const leftArea  = L * H
  const rightArea = L * H
  const ceilArea  = L * W
  const totalSurface = floorArea + ceilArea + frontArea + backArea + leftArea + rightArea

  const bareA = totalSurface * BARE_ALPHA
  const bareRT60 = sabine(V, bareA)

  const listenX = L * cfg.listenX
  const listenY = W * cfg.listenY

  const spreadY  = W * 0.30
  const spkX     = L * 0.25
  const spkLY    = W / 2 - spreadY / 2
  const spkRY    = W / 2 + spreadY / 2

  // First reflections — left speaker → left wall, right speaker → right wall
  const leftReflX_L  = spkX + (listenX - spkX) * spkLY / (spkLY + listenY)
  const leftReflX_R  = spkX + (listenX - spkX) * spkRY / (spkRY + listenY)
  const rightReflX_L = spkX + (listenX - spkX) * (W - spkRY) / ((W - spkRY) + (W - listenY))
  const rightReflX_R = spkX + (listenX - spkX) * (W - spkLY) / ((W - spkLY) + (W - listenY))
  const ceilReflX  = (spkX + listenX) / 2
  const ceilReflY  = (spkLY + listenY) / 2

  // Legacy compat
  const leftReflX = (leftReflX_L + leftReflX_R) / 2
  const rightReflX = (rightReflX_L + rightReflX_R) / 2

  const panels: PanelZone[] = []
  const PW = 0.6  // standard panel width
  const PH_WALL = 0.9  // standard panel height on wall

  // ── Bass traps — 4 corners ──
  panels.push(
    { wall: 'front', type: 'bass-trap', x: 0,       y: 0, w: 0.3, h: H, label: 'БЛ' },
    { wall: 'front', type: 'bass-trap', x: W - 0.3, y: 0, w: 0.3, h: H, label: 'БЛ' },
    { wall: 'back',  type: 'bass-trap', x: 0,       y: 0, w: 0.3, h: H, label: 'БЛ' },
    { wall: 'back',  type: 'bass-trap', x: W - 0.3, y: 0, w: 0.3, h: H, label: 'БЛ' },
  )

  // ── Front wall — 3 absorption panels between speakers ──
  const frontUsable = W - 0.8
  const frontCount = Math.max(2, Math.min(4, Math.floor(frontUsable / (PW + 0.15))))
  const frontGap = (frontUsable - frontCount * PW) / (frontCount + 1)
  for (let i = 0; i < frontCount; i++) {
    const px = 0.4 + frontGap * (i + 1) + PW * i
    panels.push({
      wall: 'front', type: 'absorption',
      x: px, y: H * 0.20, w: PW, h: PH_WALL,
      label: i === Math.floor(frontCount / 2) ? 'Фронт поглощение' : undefined,
    })
  }

  // ── Left wall — first reflections from both speakers ──
  const lrW = Math.min(0.8, L * 0.15)
  const leftPositions = [leftReflX_L, leftReflX_R].sort((a, b) => a - b)
  // Add a rear absorption panel on left wall
  const leftRear = L * 0.78
  const leftAll = [...leftPositions, leftRear]
  leftAll.forEach((rx, i) => {
    const clampedX = Math.max(0.4, Math.min(L - 0.4 - lrW, rx - lrW / 2))
    panels.push({
      wall: 'left', type: i < 2 ? 'absorption' : 'absorption',
      x: clampedX, y: H * 0.20, w: lrW, h: PH_WALL,
      label: i < 2 ? `Отражение ${i === 0 ? 'L' : 'R'}` : 'Поглощение',
    })
  })

  // ── Right wall — mirror of left ──
  const rightPositions = [rightReflX_L, rightReflX_R].sort((a, b) => a - b)
  const rightRear = L * 0.78
  const rightAll = [...rightPositions, rightRear]
  rightAll.forEach((rx, i) => {
    const clampedX = Math.max(0.4, Math.min(L - 0.4 - lrW, rx - lrW / 2))
    panels.push({
      wall: 'right', type: 'absorption',
      x: clampedX, y: H * 0.20, w: lrW, h: PH_WALL,
      label: i < 2 ? `Отражение ${i === 0 ? 'R' : 'L'}` : 'Поглощение',
    })
  })

  // ── Back wall — 2 QRD diffusers + 2 absorption panels ──
  const backUsable = W - 0.8
  const backQrdW = Math.min(0.8, backUsable * 0.35)
  const backAbsW = Math.min(0.6, backUsable * 0.25)
  const backGap = (backUsable - 2 * backQrdW - 2 * backAbsW) / 5

  panels.push(
    { wall: 'back', type: 'absorption',   x: 0.4 + backGap,                                     y: H * 0.15, w: backAbsW, h: PH_WALL, label: 'Поглощение' },
    { wall: 'back', type: 'diffuser-qrd', x: 0.4 + backGap * 2 + backAbsW,                     y: H * 0.20, w: backQrdW, h: H * 0.55, label: 'QRD' },
    { wall: 'back', type: 'diffuser-qrd', x: 0.4 + backGap * 3 + backAbsW + backQrdW,          y: H * 0.20, w: backQrdW, h: H * 0.55, label: 'QRD' },
    { wall: 'back', type: 'absorption',   x: 0.4 + backGap * 4 + backAbsW + backQrdW * 2,      y: H * 0.15, w: backAbsW, h: PH_WALL, label: 'Поглощение' },
  )

  // ── Ceiling — 2 first-reflection panels + 1 skyline ──
  const ceilPW = 1.0
  // Reflection panel between speakers and listener (left speaker path)
  const ceilRefl2Y = (spkRY + listenY) / 2
  panels.push(
    { wall: 'ceiling', type: 'absorption',       x: Math.max(0.2, ceilReflX - ceilPW / 2), y: Math.max(0.2, ceilReflY - ceilPW / 2), w: ceilPW, h: ceilPW, label: 'Потолок отр. L' },
    { wall: 'ceiling', type: 'absorption',       x: Math.max(0.2, ceilReflX - ceilPW / 2), y: Math.max(0.2, ceilRefl2Y - ceilPW / 2), w: ceilPW, h: ceilPW, label: 'Потолок отр. R' },
    { wall: 'ceiling', type: 'diffuser-skyline', x: Math.max(0.2, listenX - 0.5),          y: Math.max(0.2, W / 2 - 0.7),             w: 1.0, h: 1.4, label: 'Skyline' },
  )

  // Calculate panel areas
  const absArea     = roundTo5(panels.filter(p => p.type === 'absorption').reduce((s, p) => s + p.w * p.h, 0))
  const diffQRDArea = roundTo5(panels.filter(p => p.type === 'diffuser-qrd').reduce((s, p) => s + p.w * p.h, 0))
  const diffSkyArea = roundTo5(panels.filter(p => p.type === 'diffuser-skyline').reduce((s, p) => s + p.w * p.h, 0))

  // Derived product quantities
  const tubeTrapCount = 4
  const basaltArea = roundTo5(absArea * 0.35)
  const prdArea = roundTo5(Math.max(1, W * 0.4))
  const premiumArea = roundTo5(absArea * 0.25)

  // Treated RT60 using Sabine
  const addedA = absArea * 0.85 + diffQRDArea * 0.12 + diffSkyArea * 0.10 + 4 * H * 0.35 * 0.70
  const treatedRT60 = Math.max(0.10, sabine(V, bareA + addedA))

  const coveragePercent = Math.round((absArea + diffQRDArea + diffSkyArea) / totalSurface * 100)

  return {
    bareRT60:      Math.round(bareRT60 * 100) / 100,
    treatedRT60:   Math.round(treatedRT60 * 100) / 100,
    targetMin:     pc.rtMin,
    targetMax:     pc.rtMax,
    volume:        Math.round(V * 10) / 10,
    totalSurface:  Math.round(totalSurface * 10) / 10,
    absArea,
    diffQRDArea,
    diffSkylineArea: diffSkyArea,
    bassCorners:   4,
    tubeTrapCount,
    basaltArea,
    prdArea,
    premiumArea,
    listenPos:     { x: listenX, y: listenY },
    speakerL:      { x: spkX, y: spkLY },
    speakerR:      { x: spkX, y: spkRY },
    leftReflX,
    rightReflX,
    ceilReflX,
    ceilReflY,
    panels,
    coveragePercent,
  }
}

// ─── 2D Floor Plan SVG ────────────────────────────────────────────────────────

function FloorPlanSVG({ cfg, result }: { cfg: RoomConfig; result: RoomResult }) {
  const SVG_W = 600
  const SVG_H = 420
  const MX = 60, MY = 50
  const RW = SVG_W - MX * 2
  const RH = SVG_H - MY * 2
  const { length: L, width: W } = cfg

  const sx = (x: number) => MX + (x / L) * RW
  const sy = (y: number) => MY + (y / W) * RH
  const pw = (w: number) => (w / L) * RW
  const ph = (h: number) => (h / W) * RH

  const WALL_T = 6
  const PANEL_D = 16

  const wallPanels = result.panels.filter(p => p.wall !== 'ceiling' && p.wall !== 'floor' && p.type !== 'bass-trap')
  const ceilPanels = result.panels.filter(p => p.wall === 'ceiling')

  const renderWallPanel = (p: PanelZone, i: number) => {
    const color = ELEMENT_COLORS[p.type]
    let rx = 0, ry = 0, rw = 0, rh = 0, tx = 0, ty = 0, labelRotate = ''

    if (p.wall === 'front') {
      rx = MX + WALL_T / 2; ry = sy(p.x); rw = PANEL_D; rh = ph(p.w)
      tx = rx + PANEL_D + 3; ty = ry + rh / 2
    } else if (p.wall === 'back') {
      rx = MX + RW - WALL_T / 2 - PANEL_D; ry = sy(p.x); rw = PANEL_D; rh = ph(p.w)
      tx = rx - 3; ty = ry + rh / 2
    } else if (p.wall === 'left') {
      rx = sx(p.x); ry = MY + WALL_T / 2; rw = pw(p.w); rh = PANEL_D
      tx = rx + rw / 2; ty = ry + PANEL_D + 12
    } else if (p.wall === 'right') {
      rx = sx(p.x); ry = MY + RH - WALL_T / 2 - PANEL_D; rw = pw(p.w); rh = PANEL_D
      tx = rx + rw / 2; ty = ry - 4
    }

    const anchor = p.wall === 'back' ? 'end' : p.wall === 'front' ? 'start' : 'middle'

    return (
      <g key={`wp${i}`}>
        <rect x={rx} y={ry} width={rw} height={rh}
          fill={color} fillOpacity={0.75} stroke={color} strokeWidth={1} rx={2} />
        {p.label && (
          <text x={tx} y={ty} textAnchor={anchor} dominantBaseline="middle"
            style={{ fontSize: '8px', fill: color, fontFamily: 'sans-serif', fontWeight: 600 }}>
            {p.label}
          </text>
        )}
      </g>
    )
  }

  const BT_S = 22

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full rounded-xl" style={{ maxHeight: 440, background: '#FAFAF8' }}>
      {/* Grid */}
      {Array.from({ length: Math.ceil(L) + 1 }, (_, i) => (
        <line key={`gx${i}`} x1={sx(i)} y1={MY} x2={sx(i)} y2={MY + RH}
          stroke="#E8E4DC" strokeWidth={0.5} strokeDasharray="3 4" />
      ))}
      {Array.from({ length: Math.ceil(W) + 1 }, (_, i) => (
        <line key={`gy${i}`} x1={MX} y1={sy(i)} x2={MX + RW} y2={sy(i)}
          stroke="#E8E4DC" strokeWidth={0.5} strokeDasharray="3 4" />
      ))}

      {/* Room fill */}
      <rect x={MX} y={MY} width={RW} height={RH} fill="#F0ECE5" rx={2} />

      {/* Room outline (walls) */}
      <rect x={MX} y={MY} width={RW} height={RH}
        fill="none" stroke="#3D3028" strokeWidth={WALL_T} rx={2} />

      {/* Wall panels — rendered INSIDE room, on top of walls */}
      {wallPanels.map((p, i) => renderWallPanel(p, i))}

      {/* Bass traps — corner wedges */}
      {[
        { cx: MX, cy: MY, pts: (s: number) => `${MX},${MY} ${MX + s},${MY} ${MX},${MY + s}` },
        { cx: MX + RW, cy: MY, pts: (s: number) => `${MX + RW},${MY} ${MX + RW - s},${MY} ${MX + RW},${MY + s}` },
        { cx: MX, cy: MY + RH, pts: (s: number) => `${MX},${MY + RH} ${MX + s},${MY + RH} ${MX},${MY + RH - s}` },
        { cx: MX + RW, cy: MY + RH, pts: (s: number) => `${MX + RW},${MY + RH} ${MX + RW - s},${MY + RH} ${MX + RW},${MY + RH - s}` },
      ].map((c, i) => (
        <g key={`bt${i}`}>
          <polygon points={c.pts(BT_S)} fill={ELEMENT_COLORS['bass-trap']} fillOpacity={0.8} stroke={ELEMENT_COLORS['bass-trap']} strokeWidth={1} />
          <text x={c.cx + (c.cx === MX ? 8 : -8)} y={c.cy + (c.cy === MY ? 14 : -6)}
            textAnchor="middle"
            style={{ fontSize: '7px', fill: ELEMENT_COLORS['bass-trap'], fontFamily: 'sans-serif', fontWeight: 700 }}>
            БЛ
          </text>
        </g>
      ))}

      {/* Ceiling panels — dashed outline, NOT filled */}
      {ceilPanels.map((p, i) => {
        const cx = sx(p.x) + pw(p.w) / 2
        const cy = sy(p.y) + ph(p.h) / 2
        return (
          <g key={`cp${i}`}>
            <rect x={sx(p.x)} y={sy(p.y)} width={pw(p.w)} height={ph(p.h)}
              fill={ELEMENT_COLORS[p.type]} fillOpacity={0.08}
              stroke={ELEMENT_COLORS[p.type]} strokeWidth={1.5} strokeDasharray="6 3"
              rx={4} />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: '8px', fill: ELEMENT_COLORS[p.type], fontFamily: 'sans-serif', fontWeight: 600, opacity: 0.7 }}>
              {p.label || 'Потолок'}
            </text>
          </g>
        )
      })}

      {/* Ray lines — first reflections from both speakers to both walls */}
      {(() => {
        const lx = sx(result.listenPos.x), ly = sy(result.listenPos.y)
        const slx = sx(result.speakerL.x), sly = sy(result.speakerL.y)
        const srx = sx(result.speakerR.x), sry = sy(result.speakerR.y)

        const rays: Array<{ sx: number; sy: number; rx: number; ry: number; color: string }> = []

        // Left speaker reflections
        const llReflX = result.speakerL.x + (result.listenPos.x - result.speakerL.x) * result.speakerL.y / (result.speakerL.y + result.listenPos.y)
        const lrReflX = result.speakerL.x + (result.listenPos.x - result.speakerL.x) * (cfg.width - result.speakerL.y) / ((cfg.width - result.speakerL.y) + (cfg.width - result.listenPos.y))
        rays.push({ sx: slx, sy: sly, rx: sx(llReflX), ry: MY, color: '#3B82F6' })
        rays.push({ sx: slx, sy: sly, rx: sx(lrReflX), ry: MY + RH, color: '#3B82F6' })

        // Right speaker reflections
        const rlReflX = result.speakerR.x + (result.listenPos.x - result.speakerR.x) * result.speakerR.y / (result.speakerR.y + result.listenPos.y)
        const rrReflX = result.speakerR.x + (result.listenPos.x - result.speakerR.x) * (cfg.width - result.speakerR.y) / ((cfg.width - result.speakerR.y) + (cfg.width - result.listenPos.y))
        rays.push({ sx: srx, sy: sry, rx: sx(rlReflX), ry: MY, color: '#60A5FA' })
        rays.push({ sx: srx, sy: sry, rx: sx(rrReflX), ry: MY + RH, color: '#60A5FA' })

        return (
          <g opacity={0.25}>
            {rays.map((r, i) => (
              <g key={`ray${i}`}>
                <line x1={r.sx} y1={r.sy} x2={r.rx} y2={r.ry} stroke={r.color} strokeWidth={1} strokeDasharray="5 3" />
                <line x1={r.rx} y1={r.ry} x2={lx} y2={ly} stroke={r.color} strokeWidth={1} strokeDasharray="5 3" />
                <circle cx={r.rx} cy={r.ry} r={3} fill={r.color} fillOpacity={0.5} />
              </g>
            ))}
          </g>
        )
      })()}

      {/* Speakers */}
      {[result.speakerL, result.speakerR].map((sp, i) => {
        const cx = sx(sp.x), cy = sy(sp.y)
        const s = 8
        return (
          <g key={`sp${i}`}>
            <rect x={cx - s / 2} y={cy - s / 2} width={s} height={s} rx={2}
              fill="#1A1A1A" opacity={0.85} />
            <text x={cx} y={cy - s - 2} textAnchor="middle"
              style={{ fontSize: '8px', fill: '#1A1A1A', fontFamily: 'monospace', fontWeight: 700 }}>
              {i === 0 ? 'L' : 'R'}
            </text>
          </g>
        )
      })}

      {/* Listening position */}
      {(() => {
        const cx = sx(result.listenPos.x), cy = sy(result.listenPos.y)
        return (
          <g>
            <circle cx={cx} cy={cy} r={10} fill="white" stroke="#1A1A1A" strokeWidth={1.5} fillOpacity={0.9} />
            <circle cx={cx} cy={cy} r={3} fill="#1A1A1A" />
            <text x={cx} y={cy + 20} textAnchor="middle"
              style={{ fontSize: '9px', fill: '#1A1A1A', fontFamily: 'sans-serif', fontWeight: 600 }}>
              МП
            </text>
          </g>
        )
      })()}

      {/* Dimension arrows + labels */}
      <line x1={MX} y1={MY - 18} x2={MX + RW} y2={MY - 18} stroke="#6B5B4E" strokeWidth={0.8} markerStart="url(#arrowL)" markerEnd="url(#arrowR)" />
      <text x={MX + RW / 2} y={MY - 22} textAnchor="middle"
        style={{ fontSize: '11px', fill: '#1A1A1A', fontFamily: 'monospace', fontWeight: 600 }}>
        {L} м
      </text>
      <line x1={MX - 18} y1={MY} x2={MX - 18} y2={MY + RH} stroke="#6B5B4E" strokeWidth={0.8} />
      <text x={MX - 24} y={MY + RH / 2} textAnchor="middle" dominantBaseline="middle"
        transform={`rotate(-90, ${MX - 24}, ${MY + RH / 2})`}
        style={{ fontSize: '11px', fill: '#1A1A1A', fontFamily: 'monospace', fontWeight: 600 }}>
        {W} м
      </text>

      {/* Wall labels */}
      <text x={MX - 2} y={MY + RH / 2} textAnchor="middle" dominantBaseline="middle"
        transform={`rotate(-90, ${MX - 2}, ${MY + RH / 2})`}
        style={{ fontSize: '9px', fill: '#6B5B4E', fontFamily: 'sans-serif', letterSpacing: '0.05em' }}>
        передняя (АС)
      </text>
      <text x={MX + RW + 2} y={MY + RH / 2} textAnchor="middle" dominantBaseline="middle"
        transform={`rotate(90, ${MX + RW + 2}, ${MY + RH / 2})`}
        style={{ fontSize: '9px', fill: '#6B5B4E', fontFamily: 'sans-serif', letterSpacing: '0.05em' }}>
        задняя стена
      </text>
      <text x={MX + RW / 2} y={MY - 34} textAnchor="middle"
        style={{ fontSize: '9px', fill: '#6B5B4E', fontFamily: 'sans-serif' }}>
        левая стена
      </text>
      <text x={MX + RW / 2} y={MY + RH + 18} textAnchor="middle"
        style={{ fontSize: '9px', fill: '#6B5B4E', fontFamily: 'sans-serif' }}>
        правая стена
      </text>

      {/* Panel count badge */}
      <text x={SVG_W - 10} y={SVG_H - 8} textAnchor="end"
        style={{ fontSize: '9px', fill: '#A09888', fontFamily: 'sans-serif' }}>
        {result.panels.length} зон обработки
      </text>
    </svg>
  )
}

// ─── Wall Elevation SVG ───────────────────────────────────────────────────────

function WallElevationSVG({ wall, cfg, result, label }: {
  wall: WallId; cfg: RoomConfig; result: RoomResult; label: string
}) {
  const SVG_W = 340, SVG_H = 180
  const MX = 32, MY = 24
  const { length: L, width: W, height: H } = cfg

  // Wall dimensions
  const wallW = (wall === 'front' || wall === 'back') ? W : L
  const wallH = H
  const RW = SVG_W - MX * 2
  const RH = SVG_H - MY * 2

  const sx = (x: number) => MX + (x / wallW) * RW
  const sy = (y: number) => MY + RH - (y / wallH) * RH
  const pw = (w: number) => (w / wallW) * RW
  const ph = (h: number) => (h / wallH) * RH

  const wallPanels = result.panels.filter(p => p.wall === wall)

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full rounded-xl" style={{ background: '#FAFAF8' }}>
      {/* Room fill */}
      <rect x={MX} y={MY} width={RW} height={RH} fill="#EFEBE4" />

      {/* Panels */}
      {wallPanels.map((p, i) => (
        <rect key={i}
          x={sx(p.x)} y={sy(p.y + p.h)} width={pw(p.w)} height={ph(p.h)}
          fill={ELEMENT_COLORS[p.type]} fillOpacity={p.type === 'bass-trap' ? 0.70 : 0.80}
          rx={2}
        />
      ))}

      {/* Outline */}
      <rect x={MX} y={MY} width={RW} height={RH} fill="none" stroke="#3D3028" strokeWidth={3} />

      {/* Floor line */}
      <line x1={MX} y1={MY + RH} x2={MX + RW} y2={MY + RH} stroke="#6B5B4E" strokeWidth={2} />

      {/* Labels */}
      <text x={SVG_W / 2} y={MY - 8} textAnchor="middle"
        style={{ fontSize: '10px', fill: '#1A1A1A', fontFamily: 'sans-serif', fontWeight: 700 }}>
        {label}
      </text>
      <text x={MX + RW + 6} y={MY + RH / 2} textAnchor="start" dominantBaseline="middle"
        style={{ fontSize: '9px', fill: '#1A1A1A', fontFamily: 'monospace' }}>
        {H}м
      </text>
      <text x={MX + RW / 2} y={MY + RH + 14} textAnchor="middle"
        style={{ fontSize: '9px', fill: '#1A1A1A', fontFamily: 'monospace' }}>
        {wallW}м
      </text>
    </svg>
  )
}

// ─── Isometric 3D SVG ─────────────────────────────────────────────────────────

function IsometricSVG({ cfg, result }: { cfg: RoomConfig; result: RoomResult }) {
  const { length: L, width: W, height: H } = cfg
  const SVG_W = 560, SVG_H = 360
  const COS30 = Math.cos(Math.PI / 6)
  const SIN30 = Math.sin(Math.PI / 6)

  const maxDim = Math.max(L, W, H)
  const scale = Math.min((SVG_W * 0.32) / maxDim, (SVG_H * 0.42) / maxDim)
  const cx = SVG_W * 0.50, cy = SVG_H * 0.70

  // Isometric projection: x=length(front→back), y=height(bottom→top), z=width(left→right)
  const iso = (x: number, y: number, z: number) => ({
    sx: cx + (z - x) * COS30 * scale,
    sy: cy - y * scale + (x + z) * SIN30 * scale,
  })

  // 8 corners of room
  const v = (x: number, y: number, z: number) => iso(x, y, z)

  const FLB = v(0, 0, 0);  const FRB = v(0, 0, W)
  const FLT = v(0, H, 0);  const FRT = v(0, H, W)
  const BLB = v(L, 0, 0);  const BRB = v(L, 0, W)
  const BLT = v(L, H, 0);  const BRT = v(L, H, W)

  const pt = (p: { sx: number; sy: number }) => `${p.sx},${p.sy}`

  // Panels on visible faces (back wall, right wall, ceiling)
  const backPanels  = result.panels.filter(p => p.wall === 'back')
  const rightPanels = result.panels.filter(p => p.wall === 'right')
  const ceilPanels  = result.panels.filter(p => p.wall === 'ceiling')

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full rounded-xl" style={{ maxHeight: 360, background: '#FAFAF8' }}>
      {/* Floor */}
      <polygon points={`${pt(FLB)} ${pt(FRB)} ${pt(BRB)} ${pt(BLB)}`}
        fill="#D9CCBA" stroke="#3D3028" strokeWidth={1.5} />

      {/* Back wall face (x=L) */}
      <polygon points={`${pt(BLB)} ${pt(BRB)} ${pt(BRT)} ${pt(BLT)}`}
        fill="#EFE8DC" stroke="#3D3028" strokeWidth={1.5} />

      {/* Back wall panels */}
      {backPanels.map((p, i) => {
        const x = L
        const tl = iso(x, p.y + p.h, p.x)
        const tr = iso(x, p.y + p.h, p.x + p.w)
        const br = iso(x, p.y, p.x + p.w)
        const bl = iso(x, p.y, p.x)
        return (
          <polygon key={`bp${i}`}
            points={`${pt(tl)} ${pt(tr)} ${pt(br)} ${pt(bl)}`}
            fill={ELEMENT_COLORS[p.type]} fillOpacity={0.75}
            stroke={ELEMENT_COLORS[p.type]} strokeWidth={0.8}
          />
        )
      })}

      {/* Right wall face (z=W) */}
      <polygon points={`${pt(FRB)} ${pt(BRB)} ${pt(BRT)} ${pt(FRT)}`}
        fill="#E5DDD0" stroke="#3D3028" strokeWidth={1.5} />

      {/* Right wall panels */}
      {rightPanels.map((p, i) => {
        const z = W
        const tl = iso(p.x, p.y + p.h, z)
        const tr = iso(p.x + p.w, p.y + p.h, z)
        const br = iso(p.x + p.w, p.y, z)
        const bl = iso(p.x, p.y, z)
        return (
          <polygon key={`rp${i}`}
            points={`${pt(tl)} ${pt(tr)} ${pt(br)} ${pt(bl)}`}
            fill={ELEMENT_COLORS[p.type]} fillOpacity={0.75}
            stroke={ELEMENT_COLORS[p.type]} strokeWidth={0.8}
          />
        )
      })}

      {/* Ceiling */}
      <polygon points={`${pt(FLT)} ${pt(FRT)} ${pt(BRT)} ${pt(BLT)}`}
        fill="#F5F0E8" fillOpacity={0.65} stroke="#3D3028" strokeWidth={1.5} strokeDasharray="5 3" />

      {/* Ceiling panels */}
      {ceilPanels.map((p, i) => {
        const y = H
        const tl = iso(p.x, y, p.y)
        const tr = iso(p.x + p.w, y, p.y)
        const br = iso(p.x + p.w, y, p.y + p.h)
        const bl = iso(p.x, y, p.y + p.h)
        return (
          <polygon key={`cp${i}`}
            points={`${pt(tl)} ${pt(tr)} ${pt(br)} ${pt(bl)}`}
            fill={ELEMENT_COLORS[p.type]} fillOpacity={0.60}
            stroke={ELEMENT_COLORS[p.type]} strokeWidth={0.8}
          />
        )
      })}

      {/* Bass trap corners */}
      {[
        { x: 0, z: 0 }, { x: 0, z: W },
        { x: L, z: 0 }, { x: L, z: W },
      ].map((c, i) => {
        const bot = iso(c.x, 0, c.z)
        const top = iso(c.x, H, c.z)
        return (
          <line key={`bt3${i}`} x1={bot.sx} y1={bot.sy} x2={top.sx} y2={top.sy}
            stroke={ELEMENT_COLORS['bass-trap']} strokeWidth={6} strokeOpacity={0.7}
            strokeLinecap="round"
          />
        )
      })}

      {/* Listening position */}
      {(() => {
        const lp = iso(result.listenPos.x, 0, result.listenPos.y)
        return (
          <g>
            <circle cx={lp.sx} cy={lp.sy} r={7} fill="white" stroke="#1A1A1A" strokeWidth={1.5} />
            <circle cx={lp.sx} cy={lp.sy} r={2.5} fill="#1A1A1A" />
          </g>
        )
      })()}

      {/* Speakers */}
      {[result.speakerL, result.speakerR].map((sp, i) => {
        const p = iso(sp.x, 0, sp.y)
        return (
          <polygon key={`sp3d${i}`}
            points={`${p.sx},${p.sy - 8} ${p.sx - 6},${p.sy + 5} ${p.sx + 6},${p.sy + 5}`}
            fill="#1A1A1A" opacity={0.75}
          />
        )
      })}

      {/* Front wall outline */}
      <polygon points={`${pt(FLB)} ${pt(FRB)} ${pt(FRT)} ${pt(FLT)}`}
        fill="none" stroke="#3D3028" strokeWidth={1.5} />

      {/* Left wall outline */}
      <polygon points={`${pt(FLB)} ${pt(BLB)} ${pt(BLT)} ${pt(FLT)}`}
        fill="none" stroke="#3D3028" strokeWidth={1} strokeDasharray="4 3" />

      {/* Dimension hint */}
      <text x={8} y={SVG_H - 10}
        style={{ fontSize: '9px', fill: '#6B5B4E', fontFamily: 'monospace' }}>
        {L}×{W}×{H} м · 3D-вид
      </text>
    </svg>
  )
}

// ─── RT60 bar ─────────────────────────────────────────────────────────────────

function RT60Bar({ bare, treated, min, max }: { bare: number; treated: number; min: number; max: number }) {
  const scaleMax = Math.max(bare, 2.0)
  const pct = (v: number) => Math.min(100, (v / scaleMax) * 100)
  const targetLeft  = pct(min)
  const targetWidth = pct(max) - pct(min)

  return (
    <div className="flex flex-col gap-3">
      {[
        { label: 'До обработки', value: bare, color: '#EF4444' },
        { label: 'После обработки', value: treated, color: '#22C55E' },
      ].map(({ label, value, color }) => (
        <div key={label}>
          <div className="flex justify-between text-[12px] mb-1">
            <span style={{ color: 'var(--muted)' }}>{label}</span>
            <span className="font-semibold" style={{ color: 'var(--ink)' }}>{value.toFixed(2)} с</span>
          </div>
          <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'var(--sand)' }}>
            {/* Target zone */}
            <div className="absolute h-full rounded-full opacity-30"
              style={{ left: `${targetLeft}%`, width: `${targetWidth}%`, background: '#22C55E' }} />
            {/* Value bar */}
            <div className="absolute h-full rounded-full transition-all duration-500"
              style={{ width: `${pct(value)}%`, background: color }} />
          </div>
        </div>
      ))}
      <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
        Целевая зона RT60: {min.toFixed(2)}–{max.toFixed(2)} с (зелёная полоса)
      </p>
    </div>
  )
}

// ─── Small UI helpers ─────────────────────────────────────────────────────────

function SliderRow({
  label, value, min, max, step, unit, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; unit: string
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-[13px] font-semibold" style={{ color: 'var(--muted)' }}>{label}</span>
        <span className="text-[13px] font-semibold" style={{ color: 'var(--ink)' }}>{value} {unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full" style={{ accentColor: 'var(--accent)' }} />
      <div className="flex justify-between text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
        <span>{min} {unit}</span><span>{max} {unit}</span>
      </div>
    </div>
  )
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 text-[13px] border-b" style={{ borderColor: 'var(--line)' }}>
      <span style={{ color: 'var(--muted)' }}>{label}</span>
      <span className="font-semibold" style={{ color: 'var(--ink)' }}>{value}</span>
    </div>
  )
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-3 mt-3">
      {(Object.entries(ELEMENT_LABELS) as [ElementType, string][]).map(([type, label]) => (
        <div key={type} className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--ink)' }}>
          <div className="h-3 w-6 rounded-sm" style={{ background: ELEMENT_COLORS[type] }} />
          {label}
        </div>
      ))}
      <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--muted)' }}>
        <div className="h-3 w-6 rounded-sm border" style={{ borderStyle: 'dashed', borderColor: '#3B82F6', background: 'rgba(59,130,246,0.12)' }} />
        Потолочные (вид сверху)
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const DEFAULT_CFG: RoomConfig = {
  length: 6, width: 5, height: 2.8,
  purpose: 'home-theater',
  shape: 'rectangular',
  doors: [{ wall: 'back', pos: 0.7 }],
  windows: [],
  listenX: 0.62,
  listenY: 0.50,
}

type ViewTab = 'plan' | 'walls' | '3d'

export default function RoomDesignerClient() {
  const [cfg, setCfg] = useState<RoomConfig>(DEFAULT_CFG)
  const [view, setView] = useState<ViewTab>('plan')
  const [contactOpen, setContactOpen] = useState(false)

  const result = useMemo(() => computeRoom(cfg), [cfg])

  const set = <K extends keyof RoomConfig>(k: K, v: RoomConfig[K]) =>
    setCfg(prev => ({ ...prev, [k]: v }))

  const orderNote = `Акустический проект: ${cfg.length}×${cfg.width}×${cfg.height} м, ${PURPOSE_CONFIG[cfg.purpose].label}. Поглощение ~${result.absArea} м², QRD ~${result.diffQRDArea} м², Skyline ~${result.diffSkylineArea} м², басовые ловушки ${result.bassCorners} шт. RT60: ${result.treatedRT60} с.`

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
            <span style={{ color: 'var(--ink)' }}>Акустический проект</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="pad pt-8 pb-0">
          <div className="wrap">
            <RevealWrapper className="max-w-[720px] mb-10">
              <span className="eyebrow block mb-4">Интерактивный инструмент</span>
              <h1 className="text-[clamp(32px,4.5vw,58px)] font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-cormorant)' }}>
                Акустическое проектирование помещения
              </h1>
              <p className="mt-4 text-[16px]" style={{ color: 'var(--muted)' }}>
                Введите размеры и назначение — получите расстановку панелей, расчёт RT60 и список товаров.
                Алгоритм учитывает метод первых отражений, нормы EBU, ITU-R BS.1116, Dolby и AES.
              </p>
            </RevealWrapper>
          </div>
        </section>

        {/* Main layout */}
        <section className="pad pt-0">
          <div className="wrap">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[380px_1fr]">

              {/* ── Left: Inputs ── */}
              <RevealWrapper className="flex flex-col gap-6">

                {/* Purpose */}
                <div>
                  <h3 className="mb-3 text-[13px] font-semibold tracking-[0.07em] uppercase"
                    style={{ color: 'var(--muted)' }}>Назначение помещения</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(PURPOSE_CONFIG) as [PurposeId, typeof PURPOSE_CONFIG[PurposeId]][]).map(([id, pc]) => (
                      <button key={id} onClick={() => set('purpose', id)}
                        className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[12px] transition-all"
                        style={{
                          borderColor: cfg.purpose === id ? 'var(--accent)' : 'var(--line)',
                          background: cfg.purpose === id ? 'var(--sand)' : 'var(--cream-2)',
                          color: 'var(--ink)',
                        }}>
                        <span>{pc.icon}</span>
                        <span className="font-medium leading-tight">{pc.label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px]" style={{ color: 'var(--muted)' }}>
                    {PURPOSE_CONFIG[cfg.purpose].desc}
                  </p>
                </div>

                {/* Dimensions */}
                <div className="flex flex-col gap-4 rounded-2xl p-4"
                  style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                  <h3 className="text-[13px] font-semibold tracking-[0.07em] uppercase"
                    style={{ color: 'var(--muted)' }}>Размеры помещения</h3>
                  <SliderRow label="Длина" value={cfg.length} min={3} max={20} step={0.5} unit="м"
                    onChange={v => set('length', v)} />
                  <SliderRow label="Ширина" value={cfg.width} min={2.5} max={15} step={0.5} unit="м"
                    onChange={v => set('width', v)} />
                  <SliderRow label="Высота потолка" value={cfg.height} min={2.2} max={6} step={0.1} unit="м"
                    onChange={v => set('height', v)} />
                </div>

                {/* Listening position */}
                <div className="flex flex-col gap-3 rounded-2xl p-4"
                  style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                  <h3 className="text-[13px] font-semibold tracking-[0.07em] uppercase"
                    style={{ color: 'var(--muted)' }}>Место прослушивания</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Ближе к фронту', v: 0.45 },
                      { label: 'По центру', v: 0.55 },
                      { label: '38% от задней', v: 0.62 },
                    ].map(opt => (
                      <button key={opt.v} onClick={() => set('listenX', opt.v)}
                        className="rounded-xl border px-2 py-2 text-[11px] text-center transition-all"
                        style={{
                          borderColor: cfg.listenX === opt.v ? 'var(--accent)' : 'var(--line)',
                          background: cfg.listenX === opt.v ? 'var(--sand)' : 'transparent',
                          color: 'var(--ink)',
                        }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Room shape */}
                <div>
                  <h3 className="mb-3 text-[13px] font-semibold tracking-[0.07em] uppercase"
                    style={{ color: 'var(--muted)' }}>Форма помещения</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { id: 'rectangular', label: 'Прямоугольная', icon: '▭' },
                      { id: 'l-shaped',    label: 'Г-образная',    icon: '⌐' },
                      { id: 'angled',      label: 'Скошенные стены', icon: '⬠' },
                    ] as const).map(s => (
                      <button key={s.id} onClick={() => set('shape', s.id)}
                        className="flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-[11px] transition-all"
                        style={{
                          borderColor: cfg.shape === s.id ? 'var(--accent)' : 'var(--line)',
                          background: cfg.shape === s.id ? 'var(--sand)' : 'var(--cream-2)',
                          color: cfg.shape === s.id ? 'var(--ink)' : 'var(--muted)',
                        }}>
                        <span className="text-[20px]">{s.icon}</span>
                        <span className="leading-tight text-center">{s.label}</span>
                        {s.id !== 'rectangular' && (
                          <span className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>скоро</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button onClick={() => setContactOpen(true)} className="btn btn-dark w-full justify-center">
                  Заказать проект →
                </button>
              </RevealWrapper>

              {/* ── Right: Visualization ── */}
              <div className="flex flex-col gap-5">

                {/* Tabs */}
                <RevealWrapper>
                  <div className="flex gap-1 rounded-xl p-1" style={{ background: 'var(--cream-2)', border: '1px solid var(--line)', width: 'fit-content' }}>
                    {([
                      { id: 'plan' as ViewTab,  label: 'План (2D)' },
                      { id: 'walls' as ViewTab, label: 'Развёртки стен' },
                      { id: '3d' as ViewTab,    label: '3D-вид' },
                    ]).map(t => (
                      <button key={t.id} onClick={() => setView(t.id)}
                        className="rounded-lg px-4 py-2 text-[13px] font-medium transition-all"
                        style={{
                          background: view === t.id ? 'white' : 'transparent',
                          color: view === t.id ? 'var(--ink)' : 'var(--muted)',
                          boxShadow: view === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                        }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </RevealWrapper>

                {/* Visualization */}
                <RevealWrapper delay={80}>
                  <div className="rounded-2xl overflow-hidden p-4"
                    style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                    {view === 'plan' && (
                      <>
                        <h3 className="text-[15px] font-semibold mb-3" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                          План помещения — вид сверху
                        </h3>
                        <FloorPlanSVG cfg={cfg} result={result} />
                        <Legend />
                        <p className="mt-2 text-[11px]" style={{ color: 'var(--muted)' }}>
                          МП — место прослушивания · пунктир — пути первых отражений · ячейки — сетка 1 м
                        </p>
                      </>
                    )}

                    {view === 'walls' && (
                      <>
                        <h3 className="text-[15px] font-semibold mb-3" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                          Развёртки стен
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <WallElevationSVG wall="front" cfg={cfg} result={result} label="Передняя стена (фронт АС)" />
                          <WallElevationSVG wall="back"  cfg={cfg} result={result} label="Задняя стена (за слушателем)" />
                          <WallElevationSVG wall="left"  cfg={cfg} result={result} label="Левая стена" />
                          <WallElevationSVG wall="right" cfg={cfg} result={result} label="Правая стена" />
                        </div>
                        <Legend />
                      </>
                    )}

                    {view === '3d' && (
                      <>
                        <h3 className="text-[15px] font-semibold mb-3" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                          3D-визуализация (изометрия)
                        </h3>
                        <IsometricSVG cfg={cfg} result={result} />
                        <Legend />
                        <p className="mt-2 text-[11px]" style={{ color: 'var(--muted)' }}>
                          Показаны: задняя стена, правая стена, потолок. Басовые ловушки — вертикальные полосы по углам.
                        </p>
                      </>
                    )}
                  </div>
                </RevealWrapper>

                {/* RT60 */}
                <RevealWrapper delay={120}>
                  <div className="rounded-2xl p-5"
                    style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                    <h3 className="text-[17px] font-semibold mb-4"
                      style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                      RT60 — время реверберации
                    </h3>
                    <RT60Bar
                      bare={result.bareRT60} treated={result.treatedRT60}
                      min={result.targetMin}  max={result.targetMax}
                    />
                  </div>
                </RevealWrapper>

                {/* Key metrics */}
                <RevealWrapper delay={140}>
                  <div className="rounded-2xl p-5"
                    style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                    <h3 className="text-[17px] font-semibold mb-3"
                      style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                      Параметры помещения
                    </h3>
                    <ResultRow label="Объём" value={`${result.volume} м³`} />
                    <ResultRow label="Общая площадь поверхностей" value={`${result.totalSurface} м²`} />
                    <ResultRow label="Процент акустической обработки" value={`~${result.coveragePercent}%`} />
                    <ResultRow label="RT60 до обработки" value={`${result.bareRT60.toFixed(2)} с`} />
                    <ResultRow label="RT60 после обработки" value={`${result.treatedRT60.toFixed(2)} с`} />
                    <ResultRow label="Целевой RT60" value={`${result.targetMin.toFixed(2)}–${result.targetMax.toFixed(2)} с`} />
                  </div>
                </RevealWrapper>
              </div>
            </div>
          </div>
        </section>

        {/* ── Product recommendations ── */}
        <section className="pad border-t" style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}>
          <div className="wrap">
            <RevealWrapper className="max-w-[560px] mb-10">
              <span className="eyebrow block mb-4">Спецификация</span>
              <h2 className="text-[clamp(28px,3.5vw,44px)] font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                Рекомендуемые изделия
              </h2>
              <p className="mt-3 text-[15px]" style={{ color: 'var(--muted)' }}>
                На основе расчёта для помещения {cfg.length}×{cfg.width}×{cfg.height} м
              </p>
            </RevealWrapper>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 mb-10">
              {[
                {
                  type: 'absorption' as ElementType,
                  name: 'Тканевые акустические панели',
                  area: result.absArea,
                  unit: 'м²',
                  price: 7400,
                  href: '/catalog/fabric',
                  slug: '/catalog/fabric/panel-bazaltovoe-volokno',
                  note: 'Широкополосное поглощение 250–8000 Гц',
                  image: '/images/catalog/fabric/graphite-1.jpg',
                },
                {
                  type: 'absorption' as ElementType,
                  name: 'Панель с базальтовым наполнителем',
                  area: result.basaltArea,
                  unit: 'м²',
                  price: 8200,
                  href: '/catalog/fabric',
                  slug: '/catalog/fabric/panel-bazaltovoe-volokno',
                  note: 'Усиленное поглощение НЧ, NRC 0.95',
                  image: '/images/catalog/fabric/basalt-thumb.jpg',
                },
                {
                  type: 'absorption' as ElementType,
                  name: 'Премиум панель с замером RT60',
                  area: result.premiumArea,
                  unit: 'м²',
                  price: 9800,
                  href: '/catalog/fabric',
                  slug: '/catalog/fabric/panel-premium-rt60',
                  note: 'Калибровка под целевое время реверберации',
                  image: '/images/catalog/fabric/premium-1.jpg',
                },
                {
                  type: 'diffuser-qrd' as ElementType,
                  name: 'QRD-диффузоры',
                  area: result.diffQRDArea,
                  unit: 'м²',
                  price: 11400,
                  href: '/catalog/diffusers',
                  slug: '/catalog/diffusers/diffuzory-qrd',
                  note: 'Рассеивание — задняя стена, потолок',
                  image: '/images/catalog/diffusers/qrd-1.jpg',
                },
                {
                  type: 'diffuser-qrd' as ElementType,
                  name: 'PRD-диффузор (первичный корень)',
                  area: result.prdArea,
                  unit: 'м²',
                  price: 12200,
                  href: '/catalog/diffusers',
                  slug: '/catalog/diffusers/diffuzor-prd-pervichnyj-koren',
                  note: 'Фазовая рандомизация — передняя стена',
                  image: '/images/catalog/diffusers/qrd-1.jpg',
                },
                {
                  type: 'diffuser-skyline' as ElementType,
                  name: 'Диффузоры Skyline 3D',
                  area: result.diffSkylineArea,
                  unit: 'м²',
                  price: 13800,
                  href: '/catalog/diffusers',
                  slug: '/catalog/diffusers/diffuzor-skyline-3d',
                  note: '2D-рассеивание — потолок над слушателем',
                  image: '/images/catalog/diffusers/skyline-thumb.jpg',
                },
                {
                  type: 'bass-trap' as ElementType,
                  name: 'Угловые басовые ловушки',
                  area: result.bassCorners,
                  unit: 'пог. м',
                  price: 12600,
                  href: '/catalog/bass-traps',
                  slug: '/catalog/bass-traps/basovye-lovushki-uglovye',
                  note: `${result.bassCorners} угла × ${cfg.height} м высота`,
                  image: '/images/catalog/bass-traps/corner-1.jpg',
                },
                {
                  type: 'bass-trap' as ElementType,
                  name: 'Tube Trap — цилиндрическая ловушка',
                  area: result.tubeTrapCount,
                  unit: 'шт.',
                  price: 18500,
                  href: '/catalog/bass-traps',
                  slug: '/catalog/bass-traps/tube-trap-basovaya-lovushka',
                  note: 'Стык стена-потолок, 60–300 Гц',
                  image: '/images/catalog/bass-traps/tube-trap-1.jpg',
                },
              ].map((item, idx) => {
                const totalCost = Math.round(item.area * (item.type === 'bass-trap' ? cfg.height : 1) * item.price / 1000) * 1000
                return (
                  <RevealWrapper key={idx}>
                    <div className="flex flex-col h-full rounded-2xl border overflow-hidden transition-all hover:shadow-card"
                      style={{ background: 'var(--cream)', borderColor: 'var(--line)' }}>
                      <div className="relative w-full aspect-[4/3]">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 25vw" />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ background: ELEMENT_COLORS[item.type] }} />
                        <span className="text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: 'var(--muted)' }}>
                          {ELEMENT_LABELS[item.type]}
                        </span>
                      </div>
                      <h3 className="text-[15px] font-semibold mb-1 flex-1" style={{ color: 'var(--ink)' }}>
                        {item.name}
                      </h3>
                      <p className="text-[12px] mb-4" style={{ color: 'var(--muted)' }}>{item.note}</p>
                      <div className="flex flex-col gap-1 mb-4">
                        <div className="flex justify-between text-[13px]">
                          <span style={{ color: 'var(--muted)' }}>Количество</span>
                          <span className="font-semibold" style={{ color: 'var(--ink)' }}>
                            ~{item.area} {item.unit}
                          </span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                          <span style={{ color: 'var(--muted)' }}>Стоимость (ориент.)</span>
                          <span className="font-semibold" style={{ color: 'var(--walnut)' }}>
                            ~{totalCost.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                      </div>
                      <Link href={item.slug}
                        className="block text-center rounded-xl border py-2 text-[12px] font-medium transition-all hover:border-[var(--accent)] hover:bg-[var(--sand)]"
                        style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}>
                        В каталог →
                      </Link>
                      </div>
                    </div>
                  </RevealWrapper>
                )
              })}
            </div>

            {/* Total + CTA */}
            <RevealWrapper>
              <div className="rounded-2xl p-7 flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
                style={{ background: 'var(--walnut)' }}>
                <div>
                  <p className="text-[13px] mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Ориентировочная стоимость проекта
                  </p>
                  <p className="text-[clamp(22px,3vw,36px)] font-semibold" style={{ color: 'white', fontFamily: 'var(--font-cormorant)' }}>
                    {(() => {
                      const total = (
                        result.absArea * 7400 +
                        result.basaltArea * 8200 +
                        result.premiumArea * 9800 +
                        result.diffQRDArea * 11400 +
                        result.prdArea * 12200 +
                        result.diffSkylineArea * 13800 +
                        result.bassCorners * cfg.height * 12600 +
                        result.tubeTrapCount * 18500
                      )
                      const min = Math.round(total / 1000) * 1000
                      const max = Math.round(total * 1.35 / 1000) * 1000
                      return `${min.toLocaleString('ru-RU')} – ${max.toLocaleString('ru-RU')} ₽`
                    })()}
                  </p>
                  <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    включая материалы · монтаж рассчитывается отдельно
                  </p>
                </div>
                <div className="flex flex-col gap-2 md:w-56">
                  <button onClick={() => setContactOpen(true)}
                    className="w-full rounded-xl py-3.5 text-[14px] font-semibold transition-all hover:opacity-90"
                    style={{ background: 'white', color: 'var(--walnut)' }}>
                    Получить точный расчёт →
                  </button>
                  <button onClick={() => {
                    if (typeof window !== 'undefined') window.print()
                  }}
                    className="w-full rounded-xl border py-2.5 text-[13px] font-medium text-center transition-all hover:bg-white/10"
                    style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.70)' }}>
                    Скачать PDF (печать)
                  </button>
                </div>
              </div>
            </RevealWrapper>
          </div>
        </section>

        {/* ── Coverage recommendations ── */}
        <section className="pad border-t" style={{ borderColor: 'var(--line)' }}>
          <div className="wrap">
            <RevealWrapper className="mb-10">
              <h2 className="text-[clamp(26px,3vw,40px)] font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                Рекомендации по зонам обработки
              </h2>
            </RevealWrapper>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  zone: 'Боковые стены — первые отражения',
                  icon: '◁▷',
                  desc: 'Панели поглощения на высоте 0.8–2.2 м, симметрично от места прослушивания. Ширина зоны — 0.8–1.2 м.',
                  color: ELEMENT_COLORS['absorption'],
                },
                {
                  zone: 'Задняя стена',
                  icon: '⊡',
                  desc: 'Верхние 50–60% — QRD-диффузоры для рассеивания. Нижние 30% — поглощение для подавления рокота.',
                  color: ELEMENT_COLORS['diffuser-qrd'],
                },
                {
                  zone: 'Передняя стена',
                  icon: '▤',
                  desc: 'Широкополосное поглощение для устранения отражений между АС и местом прослушивания.',
                  color: ELEMENT_COLORS['absorption'],
                },
                {
                  zone: 'Потолок',
                  icon: '⬚',
                  desc: 'Панели поглощения в зоне первого отражения + Skyline над местом прослушивания для рассеивания.',
                  color: ELEMENT_COLORS['diffuser-skyline'],
                },
                {
                  zone: 'Углы помещения',
                  icon: '◤',
                  desc: 'Басовые ловушки от пола до потолка во всех 4 угловых зонах. Критически важны для контроля низких частот.',
                  color: ELEMENT_COLORS['bass-trap'],
                },
                {
                  zone: 'Верх передней стены',
                  icon: '◈',
                  desc: 'Skyline-диффузоры в верхней трети передней стены — дополнительное рассеивание и эстетика.',
                  color: ELEMENT_COLORS['diffuser-skyline'],
                },
              ].map(z => (
                <RevealWrapper key={z.zone}>
                  <div className="flex gap-4 rounded-2xl border p-5"
                    style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}>
                    <div className="flex-shrink-0 text-[24px] w-10 text-center" style={{ color: z.color }}>
                      {z.icon}
                    </div>
                    <div>
                      <h3 className="text-[14px] font-semibold mb-1" style={{ color: 'var(--ink)' }}>{z.zone}</h3>
                      <p className="text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>{z.desc}</p>
                    </div>
                  </div>
                </RevealWrapper>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cross-links ── */}
        <section className="pad border-t" style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}>
          <div className="wrap">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { href: '/calculator', label: 'Калькулятор стоимости', desc: 'Быстрая оценка бюджета', icon: '⊡' },
                { href: '/diffuser',   label: 'Калькулятор QRD',       desc: 'Расчёт диффузора Шрёдера', icon: '◫' },
                { href: '/skyline',    label: 'Калькулятор Skyline',   desc: 'Расчёт Skyline-диффузора', icon: '▦' },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  className="group flex items-center gap-4 rounded-2xl border p-5 transition-all hover:border-[var(--taupe)] hover:shadow-card"
                  style={{ background: 'var(--cream)', borderColor: 'var(--line)' }}>
                  <div className="text-[22px] flex-shrink-0">{l.icon}</div>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold" style={{ color: 'var(--ink)' }}>{l.label}</p>
                    <p className="text-[12px]" style={{ color: 'var(--muted)' }}>{l.desc}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"
                    className="flex-shrink-0 transition-transform group-hover:translate-x-1">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <BackToTop />
      <FloatingContact />

      <Modal open={contactOpen} onClose={() => setContactOpen(false)}
        title="Заказать акустический проект" size="lg">
        <ContactForm onSuccess={() => setContactOpen(false)} defaultComment={orderNote} />
      </Modal>
    </>
  )
}
