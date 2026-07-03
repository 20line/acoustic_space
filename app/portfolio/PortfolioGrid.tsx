'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { portfolioProjects } from '@/data/portfolio'

const FILTERS = [
  { label: 'Все проекты', value: 'all' },
  { label: 'Домашний кинотеатр', value: 'home-theater' },
  { label: 'Студия', value: 'studio' },
  { label: 'Офис', value: 'office' },
  { label: 'Ресторан', value: 'restaurant' },
  { label: 'Hi-Fi', value: 'hifi' },
  { label: 'Репетиционная', value: 'rehearsal' },
]

const categoryLabels: Record<string, string> = {
  studio: 'Студия',
  'home-theater': 'Кинотеатр',
  hifi: 'Hi-Fi',
  office: 'Офис',
  restaurant: 'Ресторан',
  rehearsal: 'Репетиционная',
}

export function PortfolioGrid() {
  const [active, setActive] = useState('all')

  const filtered =
    active === 'all' ? portfolioProjects : portfolioProjects.filter((p) => p.category === active)

  return (
    <>
      {/* Filters */}
      <RevealWrapper className="mb-10 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className="rounded-full border px-5 py-2 text-[13px] font-semibold transition-all duration-200"
            style={{
              borderColor: active === f.value ? 'var(--accent)' : 'var(--line)',
              color: active === f.value ? '#fff' : 'var(--ink)',
              background: active === f.value ? 'var(--accent)' : 'transparent',
            }}
          >
            {f.label}
          </button>
        ))}
      </RevealWrapper>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => (
          <RevealWrapper key={project.id} delay={(i % 3) * 80}>
            <Link
              href={`/portfolio/${project.slug}`}
              className="group block overflow-hidden rounded-[8px] shadow-premium"
              style={{ background: 'var(--cream-2)' }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSIzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM3YTVhM2MiLz48L3N2Zz4="
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 -z-10 seg-bg-2" aria-hidden />
                <span
                  className="absolute top-3 right-3 rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase"
                  style={{ background: 'rgba(0,0,0,0.35)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}
                >
                  {project.area} м²
                </span>
              </div>
              <div className="p-6">
                <span className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--accent)' }}>
                  {categoryLabels[project.category]} · {project.location}
                </span>
                <h3 className="mt-2 mb-1 text-[24px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  {project.title}
                </h3>
                <p className="text-[13px]" style={{ color: 'var(--muted)' }}>
                  {project.panelsUsed.slice(0, 2).join(', ')}
                </p>
              </div>
            </Link>
          </RevealWrapper>
        ))}
      </div>
    </>
  )
}
