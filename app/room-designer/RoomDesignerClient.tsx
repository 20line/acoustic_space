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

  // Bare room RT60
  const bareA = totalSurface * BARE_ALPHA
  const bareRT60 = sabine(V, bareA)

  // Target RT60
  const targetMid = (pc.rtMin + pc.rtMax) / 2

  // Listening & speaker positions (in meters)
  const listenX = L * cfg.listenX
  const listenY = W * cfg.listenY

  const spreadY  = W * 0.30
  const spkX     = L * 0.25
  const spkLY    = W / 2 - spreadY / 2
  const spkRY    = W / 2 + spreadY / 2

  // First reflection on left wall (y=0): mirror listener across y=0
  const leftReflX  = spkX + (listenX - spkX) * spkRY / (spkRY + listenY)
  // First reflection on right wall (y=W): mirror listener across y=W
  const rightReflX = spkX + (listenX - spkX) * (W - spkLY) / ((W - spkLY) + (W - listenY))
  // Ceiling reflection (approx midpoint between speaker and listener)
  const ceilReflX  = (spkX + listenX) / 2
  const ceilReflY  = (spkLY + listenY) / 2

  // Build panel zones
  const panels: PanelZone[] = []

  // Bass traps — all 4 floor-to-ceiling corners
  panels.push(
    { wall: 'front', type: 'bass-trap', x: 0,         y: 0, w: 0.3, h: H, label: 'Ловушка FL' },
    { wall: 'front', type: 'bass-trap', x: W - 0.3,   y: 0, w: 0.3, h: H, label: 'Ловушка FR' },
    { wall: 'back',  type: 'bass-trap', x: 0,         y: 0, w: 0.3, h: H, label: 'Ловушка BL' },
    { wall: 'back',  type: 'bass-trap', x: W - 0.3,   y: 0, w: 0.3, h: H, label: 'Ловушка BR' },
  )

  // Front wall — absorption, center section (skip corners already occupied)
  const frontPanelW = Math.max(0.5, W - 0.6)
  panels.push({ wall: 'front', type: 'absorption', x: 0.3, y: H * 0.15, w: frontPanelW, h: H * 0.70 })

  // Left wall — first reflection
  const lrW = Math.min(1.2, L * 0.20)
  panels.push({
    wall: 'left', type: 'absorption',
    x: Math.max(0.3, leftReflX - lrW / 2), y: H * 0.20, w: lrW, h: H * 0.55,
    label: 'Первое отражение'
  })

  // Right wall — mirror
  panels.push({
    wall: 'right', type: 'absorption',
    x: Math.max(0.3, rightReflX - lrW / 2), y: H * 0.20, w: lrW, h: H * 0.55,
    label: 'Первое отражение'
  })

  // Back wall — QRD upper, absorption lower
  const backPanelW = Math.max(0.5, W - 0.6)
  panels.push(
    { wall: 'back', type: 'diffuser-qrd',  x: 0.3, y: H * 0.45, w: backPanelW, h: H * 0.50, label: 'QRD рассеивание' },
    { wall: 'back', type: 'absorption',    x: 0.3, y: H * 0.10, w: backPanelW, h: H * 0.30, label: 'Поглощение низа' },
  )

  // Ceiling — first reflection + skyline on rear zone
  panels.push(
    { wall: 'ceiling', type: 'absorption',       x: Math.max(0, ceilReflX - 0.8), y: Math.max(0, ceilReflY - 0.8), w: 1.5, h: 1.5, label: 'Первое отражение' },
    { wall: 'ceiling', type: 'diffuser-skyline', x: listenX - 0.6, y: W / 2 - 0.9, w: 1.2, h: 1.8, label: 'Skyline над слушателем' },
  )

  // Calculate panel areas
  const absArea     = roundTo5(panels.filter(p => p.type === 'absorption').reduce((s, p) => s + p.w * p.h, 0))
  const diffQRDArea = roundTo5(panels.filter(p => p.type === 'diffuser-qrd').reduce((s, p) => s + p.w * p.h, 0))
  const diffSkyArea = roundTo5(panels.filter(p => p.type === 'diffuser-skyline').reduce((s, p) => s + p.w * p.h, 0))

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
  const SVG_W = 560
  const SVG_H = 380
  const MX = 54, MY = 44  // margins
  const RW = SVG_W - MX * 2
  const RH = SVG_H - MY * 2
  const { length: L, width: W } = cfg

  const sx = (x: number) => MX + (x / L) * RW
  const sy = (y: number) => MY + (y / W) * RH
  const pw = (w: number) => (w / L) * RW
  const ph = (h: number) => (h / W) * RH

  const WALL_T = 10  // wall thickness px
  const PANEL_T = 8  // panel depth px on wall

  // Floor plan panels (only wall panels, ceiling shown as inset)
  const wallPanels = result.panels.filter(p => p.wall !== 'ceiling' && p.wall !== 'floor' && p.type !== 'bass-trap')
  const bassTraps  = result.panels.filter(p => p.type === 'bass-trap')
  const ceilPanels = result.panels.filter(p => p.wall === 'ceiling')

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full rounded-xl" style={{ maxHeight: 400, background: '#FAFAF8' }}>
      {/* Grid */}
      {Array.from({ length: Math.ceil(L) + 1 }, (_, i) => (
        <line key={`gx${i}`} x1={sx(i)} y1={MY} x2={sx(i)} y2={MY + RH}
          stroke="#E5E0D8" strokeWidth={0.5} strokeDasharray="3 4" />
      ))}
      {Array.from({ length: Math.ceil(W) + 1 }, (_, i) => (
        <line key={`gy${i}`} x1={MX} y1={sy(i)} x2={MX + RW} y2={sy(i)}
          stroke="#E5E0D8" strokeWidth={0.5} strokeDasharray="3 4" />
      ))}

      {/* Room fill */}
      <rect x={MX} y={MY} width={RW} height={RH} fill="#EFEBE4" />

      {/* Ceiling panels (shown semi-transparent as floor overlay) */}
      {ceilPanels.map((p, i) => (
        <rect key={`cp${i}`}
          x={sx(p.x)} y={sy(p.y)} width={pw(p.w)} height={ph(p.h)}
          fill={ELEMENT_COLORS[p.type]} fillOpacity={0.18}
          stroke={ELEMENT_COLORS[p.type]} strokeWidth={1} strokeDasharray="4 3"
          rx={3}
        />
      ))}

      {/* Wall panels — left wall (top edge) */}
      {wallPanels.filter(p => p.wall === 'left').map((p, i) => (
        <rect key={`lw${i}`}
          x={sx(p.x)} y={MY} width={pw(p.w)} height={PANEL_T}
          fill={ELEMENT_COLORS[p.type]} fillOpacity={0.85} rx={2}
        />
      ))}
      {/* Wall panels — right wall (bottom edge) */}
      {wallPanels.filter(p => p.wall === 'right').map((p, i) => (
        <rect key={`rw${i}`}
          x={sx(p.x)} y={MY + RH - PANEL_T} width={pw(p.w)} height={PANEL_T}
          fill={ELEMENT_COLORS[p.type]} fillOpacity={0.85} rx={2}
        />
      ))}
      {/* Wall panels — front wall (left edge) */}
      {wallPanels.filter(p => p.wall === 'front').map((p, i) => (
        <rect key={`fw${i}`}
          x={MX} y={sy(p.x)} width={PANEL_T} height={ph(p.w)}
          fill={ELEMENT_COLORS[p.type]} fillOpacity={0.85} rx={2}
        />
      ))}
      {/* Wall panels — back wall (right edge) */}
      {wallPanels.filter(p => p.wall === 'back').map((p, i) => (
        <rect key={`bw${i}`}
          x={MX + RW - PANEL_T} y={sy(p.x)} width={PANEL_T} height={ph(p.w)}
          fill={ELEMENT_COLORS[p.type]} fillOpacity={0.85} rx={2}
        />
      ))}

      {/* Bass traps — corners */}
      {[
        { x: MX, y: MY },
        { x: MX + RW, y: MY },
        { x: MX, y: MY + RH },
        { x: MX + RW, y: MY + RH },
      ].map((c, i) => {
        const s = 18
        const pts = i === 0 ? `${c.x},${c.y} ${c.x + s},${c.y} ${c.x},${c.y + s}` :
                    i === 1 ? `${c.x},${c.y} ${c.x - s},${c.y} ${c.x},${c.y + s}` :
                    i === 2 ? `${c.x},${c.y} ${c.x + s},${c.y} ${c.x},${c.y - s}` :
                              `${c.x},${c.y} ${c.x - s},${c.y} ${c.x},${c.y - s}`
        return <polygon key={`bt${i}`} points={pts} fill={ELEMENT_COLORS['bass-trap']} fillOpacity={0.85} />
      })}

      {/* Room outline */}
      <rect x={MX} y={MY} width={RW} height={RH}
        fill="none" stroke="#3D3028" strokeWidth={WALL_T} />

      {/* Ray lines — first reflections */}
      {(() => {
        const lx = sx(result.listenPos.x), ly = sy(result.listenPos.y)
        const slx = sx(result.speakerL.x), sly = sy(result.speakerL.y)
        const srx = sx(result.speakerR.x), sry = sy(result.speakerR.y)
        const lrx = sx(result.leftReflX),  lry = MY
        const rrx = sx(result.rightReflX), rry = MY + RH
        return (
          <g opacity={0.35}>
            <line x1={srx} y1={sry} x2={lrx} y2={lry} stroke="#3B82F6" strokeWidth={1} strokeDasharray="5 3" />
            <line x1={lrx} y1={lry} x2={lx}  y2={ly}  stroke="#3B82F6" strokeWidth={1} strokeDasharray="5 3" />
            <line x1={slx} y1={sly} x2={rrx} y2={rry} stroke="#3B82F6" strokeWidth={1} strokeDasharray="5 3" />
            <line x1={rrx} y1={rry} x2={lx}  y2={ly}  stroke="#3B82F6" strokeWidth={1} strokeDasharray="5 3" />
          </g>
        )
      })()}

      {/* Speakers */}
      {[result.speakerL, result.speakerR].map((sp, i) => {
        const cx = sx(sp.x), cy = sy(sp.y)
        const s = 9
        return (
          <g key={`sp${i}`}>
            <polygon points={`${cx},${cy - s} ${cx - s},${cy + s} ${cx + s},${cy + s}`}
              fill="#1A1A1A" opacity={0.8} />
            <text x={cx} y={cy - s - 5} textAnchor="middle"
              style={{ fontSize: '8px', fill: '#1A1A1A', fontFamily: 'monospace' }}>
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
            <circle cx={cx} cy={cy} r={3}  fill="#1A1A1A" />
            <text x={cx} y={cy + 20} textAnchor="middle"
              style={{ fontSize: '9px', fill: '#1A1A1A', fontFamily: 'sans-serif', fontWeight: 600 }}>
              МП
            </text>
          </g>
        )
      })()}

      {/* Dimension labels */}
      <text x={MX + RW / 2} y={MY - 8} textAnchor="middle"
        style={{ fontSize: '11px', fill: '#1A1A1A', fontFamily: 'monospace', fontWeight: 600 }}>
        {L} м
      </text>
      <text x={MX - 10} y={MY + RH / 2} textAnchor="middle" dominantBaseline="middle"
        transform={`rotate(-90, ${MX - 10}, ${MY + RH / 2})`}
        style={{ fontSize: '11px', fill: '#1A1A1A', fontFamily: 'monospace', fontWeight: 600 }}>
        {W} м
      </text>

      {/* Wall labels */}
      <text x={MX + RW / 2} y={MY + RH + 18} textAnchor="middle"
        style={{ fontSize: '9px', fill: '#6B5B4E', fontFamily: 'sans-serif' }}>
        задняя стена
      </text>
      <text x={MX + RW / 2} y={MY - 22} textAnchor="middle"
        style={{ fontSize: '9px', fill: '#6B5B4E', fontFamily: 'sans-serif' }}>
        передняя стена (АС)
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
                  slug: '/catalog/fabric/tkanevye-paneli-grafit',
                  note: 'Широкополосное поглощение 250–8000 Гц',
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
                },
                {
                  type: 'diffuser-skyline' as ElementType,
                  name: 'Диффузоры Skyline',
                  area: result.diffSkylineArea,
                  unit: 'м²',
                  price: 13800,
                  href: '/catalog/diffusers',
                  slug: '/catalog/diffusers',
                  note: '2D-рассеивание — потолок над слушателем',
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
                },
              ].map(item => {
                const totalCost = Math.round(item.area * (item.type === 'bass-trap' ? cfg.height : 1) * item.price / 1000) * 1000
                return (
                  <RevealWrapper key={item.type}>
                    <div className="flex flex-col h-full rounded-2xl border p-5 transition-all hover:shadow-card"
                      style={{ background: 'var(--cream)', borderColor: 'var(--line)' }}>
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
                        result.diffQRDArea * 11400 +
                        result.diffSkylineArea * 13800 +
                        result.bassCorners * cfg.height * 12600
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
