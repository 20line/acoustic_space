import { Metadata } from 'next'
import { notFound } from 'next/navigation'
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
import { getSegmentBySlug, getAllSegmentSlugs } from '@/data/segments'
import { products } from '@/data/products'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL, SITE_NAME } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSegmentSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const segment = getSegmentBySlug(slug)
  if (!segment) return {}
  return buildMetadata({
    title: segment.title + ' — акустические решения',
    description: segment.tagline + '. ' + segment.description.slice(0, 120) + '...',
    path: '/segments/' + slug,
  })
}

const BLUR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM3YzUyMzIiLz48L3N2Zz4='

export default async function SegmentPage({ params }: Props) {
  const { slug } = await params
  const segment = getSegmentBySlug(slug)
  if (!segment) notFound()

  const recommendedProducts = products
    .filter((p) => segment.recommendedCategories.includes(p.category))
    .slice(0, 6)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Для кого', item: `${SITE_URL}/segments` },
      { '@type': 'ListItem', position: 3, name: segment.title, item: `${SITE_URL}/segments/${slug}` },
    ],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: segment.title,
    description: segment.description,
    url: `${SITE_URL}/segments/${slug}`,
    provider: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
    areaServed: 'RU',
  }

  return (
    <>
      <ProgressBar />
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <main className="pt-24">
        <div className="wrap py-4">
          <nav className="flex flex-wrap gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <Link href="/segments" className="hover:text-accent">Для кого</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>{segment.title}</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="pad pt-8">
          <div className="wrap">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 items-center">
              <RevealWrapper>
                <span className="eyebrow block mb-4">Для кого</span>
                <h1
                  className="text-[clamp(32px,5vw,64px)] font-semibold leading-tight mb-4"
                  style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
                >
                  {segment.title}
                </h1>
                <p
                  className="text-[20px] mb-6"
                  style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--walnut)', fontStyle: 'italic' }}
                >
                  {segment.tagline}
                </p>
                <p className="text-[16px] leading-relaxed mb-8 max-w-[520px]" style={{ color: 'var(--muted)' }}>
                  {segment.description}
                </p>
                <Link href="/contacts" className="btn btn-dark">
                  {segment.ctaText}
                </Link>
              </RevealWrapper>
              <RevealWrapper delay={120}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-premium">
                  <Image
                    src={segment.heroImage}
                    alt={segment.title}
                    fill
                    priority
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={BLUR}
                    sizes="(max-width:1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 -z-10" style={{ background: 'var(--walnut)' }} />
                </div>
              </RevealWrapper>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="pad border-t" style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}>
          <div className="wrap">
            <RevealWrapper className="mb-12 max-w-[560px]">
              <span className="eyebrow block mb-4">Акустические задачи</span>
              <h2
                className="text-[clamp(26px,3.5vw,44px)] font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
              >
                Что важно учесть
              </h2>
            </RevealWrapper>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {segment.features.map((feat, i) => (
                <RevealWrapper key={feat.title} delay={i * 60}>
                  <div
                    className="flex flex-col gap-3 rounded-xl p-6 border"
                    style={{ background: 'var(--cream)', borderColor: 'var(--line)' }}
                  >
                    <span
                      className="text-[24px]"
                      style={{ color: 'var(--walnut)' }}
                    >
                      {feat.icon}
                    </span>
                    <h3
                      className="text-[20px] font-semibold"
                      style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
                    >
                      {feat.title}
                    </h3>
                    <p className="text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {feat.description}
                    </p>
                  </div>
                </RevealWrapper>
              ))}
            </div>
          </div>
        </section>

        {/* Recommended products */}
        {recommendedProducts.length > 0 && (
          <section className="pad">
            <div className="wrap">
              <RevealWrapper className="mb-12">
                <span className="eyebrow block mb-4">Рекомендуемые решения</span>
                <div className="flex items-end justify-between flex-wrap gap-4">
                  <h2
                    className="text-[clamp(26px,3.5vw,44px)] font-semibold"
                    style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
                  >
                    Подходящие панели
                  </h2>
                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
                    style={{ color: 'var(--accent)' }}
                  >
                    Весь каталог <ArrowRight size={14} />
                  </Link>
                </div>
              </RevealWrapper>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedProducts.map((product, i) => (
                  <RevealWrapper key={product.id} delay={i * 60}>
                    <Link
                      href={'/catalog/' + product.category + '/' + product.slug}
                      className="group block overflow-hidden rounded-[8px] shadow-premium transition-transform duration-300 hover:-translate-y-2"
                      style={{ background: 'var(--cream-2)' }}
                    >
                      <div className="relative aspect-[16/11] overflow-hidden">
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                          placeholder="blur"
                          blurDataURL={BLUR}
                          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 -z-10" style={{ background: 'var(--walnut)' }} />
                      </div>
                      <div className="p-5">
                        <h3
                          className="text-[22px] font-semibold leading-tight mb-1"
                          style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
                        >
                          {product.name}
                        </h3>
                        <p className="text-[13px] mb-3" style={{ color: 'var(--muted)' }}>
                          {product.tagline}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-semibold">
                            от {product.price.toLocaleString('ru-RU')} ₽
                          </span>
                          <span
                            className="inline-flex items-center gap-1 text-[13px] font-semibold"
                            style={{ color: 'var(--accent)' }}
                          >
                            Подробнее <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </RevealWrapper>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recommendation quote */}
        <section className="pad border-t border-b" style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}>
          <div className="wrap">
            <RevealWrapper className="max-w-[700px] mx-auto text-center">
              <span className="eyebrow block mb-6">Наша рекомендация</span>
              <p
                className="text-[clamp(18px,2.5vw,26px)] leading-relaxed font-medium"
                style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
              >
                {segment.recommendations}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/contacts" className="btn btn-dark">
                  {segment.ctaText}
                </Link>
                <Link href="/portfolio" className="btn btn-outline">
                  Посмотреть портфолио
                </Link>
              </div>
            </RevealWrapper>
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
