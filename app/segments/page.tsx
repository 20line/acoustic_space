import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { CtaBandSection } from '@/components/sections/CtaBandSection'
import { segmentsData } from '@/data/segments'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL, SITE_NAME } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Для кого — акустические решения по сценариям',
  description: 'Акустические решения для домашних кинотеатров, студий звукозаписи, Hi-Fi комнат, офисов, ресторанов и репетиционных баз.',
  path: '/segments',
})

const segmentsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Акустические решения по сценариям',
  url: `${SITE_URL}/segments`,
  numberOfItems: segmentsData.length,
  itemListElement: segmentsData.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: s.title,
    url: `${SITE_URL}/segments/${s.slug}`,
  })),
  provider: {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
  },
}

const BLUR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM3YzUyMzIiLz48L3N2Zz4='

export default function SegmentsPage() {
  return (
    <>
      <ProgressBar />
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(segmentsSchema) }}
      />
      <main className="pt-24">
        <div className="wrap py-4">
          <nav className="flex gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>Для кого</span>
          </nav>
        </div>

        <section className="pad pt-8">
          <div className="wrap">
            <RevealWrapper className="mb-14 max-w-[660px]">
              <span className="eyebrow block mb-4">Для кого</span>
              <h1
                className="text-[clamp(36px,5vw,64px)] font-semibold leading-tight mb-4"
                style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
              >
                Акустика под ваш сценарий
              </h1>
              <p className="text-[17px]" style={{ color: 'var(--muted)' }}>
                Каждый тип помещения имеет свои акустические задачи. Выберите сценарий — покажем рекомендуемые решения и примеры реализованных проектов.
              </p>
            </RevealWrapper>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {segmentsData.map((seg, i) => (
                <RevealWrapper key={seg.slug} delay={i * 60}>
                  <Link
                    href={'/segments/' + seg.slug}
                    className="group block overflow-hidden rounded-xl shadow-premium transition-all duration-300 hover:-translate-y-2"
                    style={{ background: 'var(--cream-2)' }}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={seg.heroImage}
                        alt={seg.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        placeholder="blur"
                        blurDataURL={BLUR}
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 -z-10" style={{ background: 'var(--walnut)' }} />
                    </div>
                    <div className="p-6">
                      <h2
                        className="text-[24px] font-semibold leading-tight mb-2"
                        style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
                      >
                        {seg.title}
                      </h2>
                      <p className="text-[14px] mb-4" style={{ color: 'var(--muted)' }}>
                        {seg.tagline}
                      </p>
                      <span
                        className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
                        style={{ color: 'var(--accent)' }}
                      >
                        Подробнее
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </RevealWrapper>
              ))}
            </div>
          </div>
        </section>

        <CtaBandSection />
      </main>
      <Footer />
      <BackToTop />
      <FloatingContact />
    </>
  )
}
