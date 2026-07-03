import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL, SITE_NAME } from '@/lib/utils'
import { portfolioProjects } from '@/data/portfolio'
import { PortfolioGrid } from './PortfolioGrid'

export const metadata: Metadata = buildMetadata({
  title: 'Портфолио акустических проектов — студии, кинотеатры, офисы',
  description: 'Реализованные проекты акустической отделки: домашние кинотеатры, студии звукозаписи, hi-fi комнаты, офисы и рестораны. Фото и описание каждого объекта.',
  path: '/portfolio',
})

const portfolioSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Портфолио акустических проектов',
  url: `${SITE_URL}/portfolio`,
  numberOfItems: portfolioProjects.length,
  itemListElement: portfolioProjects.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: p.title,
    url: `${SITE_URL}/portfolio/${p.slug}`,
    image: p.thumbnail,
  })),
  provider: {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
  },
}

export default function PortfolioPage() {
  return (
    <>
      <ProgressBar />
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
      <main className="pt-24">
        <div className="wrap py-4">
          <nav className="flex gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>Портфолио</span>
          </nav>
        </div>

        <section className="pad pt-8">
          <div className="wrap">
            <RevealWrapper className="max-w-[660px] mb-12">
              <span className="eyebrow block mb-4">Галерея проектов</span>
              <h1
                className="text-[clamp(36px,5vw,64px)] font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                Наши объекты
              </h1>
              <p className="mt-4 text-[17px]" style={{ color: 'var(--muted)' }}>
                Студии, кинозалы и комнаты прослушивания, где звук стал частью архитектуры.
              </p>
            </RevealWrapper>

            <PortfolioGrid />
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <FloatingContact />
    </>
  )
}
