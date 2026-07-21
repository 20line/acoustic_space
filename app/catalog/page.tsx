import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { products, productCategories } from '@/data/products'
import { ArrowRight } from 'lucide-react'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL, SITE_NAME } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Каталог акустических панелей',
  description: 'Реечные, тканевые и художественные акустические панели. Басовые ловушки и диффузоры. Расчёт и производство под заказ.',
  path: '/catalog',
})

const catalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Каталог акустических панелей',
  url: `${SITE_URL}/catalog`,
  numberOfItems: productCategories.length,
  itemListElement: productCategories.map((cat, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: cat.label,
    url: `${SITE_URL}/catalog/${cat.slug}`,
  })),
  provider: {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
  },
}

export default function CatalogPage() {
  return (
    <>
      <ProgressBar />
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }}
      />
      <main className="pt-24">
        {/* Breadcrumb */}
        <div className="wrap py-4">
          <nav className="flex gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>Каталог</span>
          </nav>
        </div>

        {/* Header */}
        <section className="pad pt-8">
          <div className="wrap">
            <RevealWrapper className="max-w-[660px]">
              <span className="eyebrow block mb-4">Каталог продукции</span>
              <h1
                className="text-[clamp(36px,5vw,64px)] font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                Акустические панели
              </h1>
              <p className="mt-4 text-[17px] max-w-[500px]" style={{ color: 'var(--muted)' }}>
                Инженерные решения для контроля акустики — от реечных панелей из ценных пород до диффузоров-арт-объектов.
              </p>
            </RevealWrapper>
          </div>
        </section>

        {/* Categories */}
        <section className="pad pt-0">
          <div className="wrap">
            {productCategories.map((cat, ci) => {
              const catProducts = products.filter((p) => p.category === cat.slug)
              return (
                <div key={cat.slug} className="mb-20">
                  <RevealWrapper>
                    <div className="flex items-end justify-between mb-8 border-b pb-4" style={{ borderColor: 'var(--line)' }}>
                      <div>
                        <span className="eyebrow block mb-2">{String(ci + 1).padStart(2, '0')}</span>
                        <h2
                          className="text-[clamp(28px,3.5vw,42px)] font-semibold"
                          style={{ fontFamily: 'var(--font-cormorant)' }}
                        >
                          {cat.label}
                        </h2>
                      </div>
                      <Link
                        href={`/catalog/${cat.slug}`}
                        className="hidden sm:inline-flex items-center gap-2 text-[13px] font-semibold"
                        style={{ color: 'var(--accent)' }}
                      >
                        Все {cat.label.toLowerCase()}
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </RevealWrapper>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {catProducts.map((product, i) => (
                      <RevealWrapper key={product.id} delay={i * 70}>
                        <Link
                          href={`/catalog/${product.category}/${product.slug}`}
                          className="group block overflow-hidden rounded-[8px] shadow-premium transition-transform duration-300 ease-spring hover:-translate-y-2"
                          style={{ background: 'var(--cream-2)' }}
                        >
                          <div className="relative aspect-[16/11] overflow-hidden" style={{ background: '#f5f3ef' }}>
                            <Image
                              src={product.thumbnail}
                              alt={product.name}
                              fill
                              className="object-contain p-3 transition-transform duration-700 group-hover:scale-[1.04]"
                              placeholder="blur"
                              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmNWYzZWYiLz48L3N2Zz4="
                              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                            />
                          </div>
                          <div className="p-6 pb-7">
                            <h3
                              className="mb-1.5 text-[24px] font-semibold leading-tight"
                              style={{ fontFamily: 'var(--font-cormorant)' }}
                            >
                              {product.name}
                            </h3>
                            <p className="mb-4 text-[13px]" style={{ color: 'var(--muted)' }}>
                              {product.tagline}
                            </p>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="block text-[14px] font-semibold">
                                  от {product.price.toLocaleString('ru-RU')} ₽
                                </span>
                                <span className="text-[11px] tracking-[0.04em]" style={{ color: 'var(--muted)' }}>
                                  {product.priceUnit}
                                </span>
                              </div>
                              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: 'var(--accent)' }}>
                                Подробнее
                                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      </RevealWrapper>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <FloatingContact />
    </>
  )
}
