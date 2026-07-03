import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { ProductCard } from '@/components/catalog/ProductCard'
import { getProductsByCategory, productCategories } from '@/data/products'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL } from '@/lib/utils'

interface Props {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  return productCategories.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = productCategories.find((c) => c.slug === category)
  if (!cat) return {}
  return buildMetadata({
    title: cat.label,
    description: `${cat.label} — производство под заказ с расчётом акустических параметров.`,
    path: `/catalog/${category}`,
  })
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = productCategories.find((c) => c.slug === category)
  if (!cat) notFound()

  const products = getProductsByCategory(category)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: `${SITE_URL}/catalog` },
      { '@type': 'ListItem', position: 3, name: cat.label, item: `${SITE_URL}/catalog/${category}` },
    ],
  }

  return (
    <>
      <ProgressBar />
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="pt-24">
        <div className="wrap py-4">
          <nav className="flex gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-accent">Каталог</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>{cat.label}</span>
          </nav>
        </div>

        <section className="pad pt-8">
          <div className="wrap">
            <RevealWrapper className="max-w-[660px] mb-14">
              <span className="eyebrow block mb-4">{cat.label}</span>
              <h1
                className="text-[clamp(36px,5vw,64px)] font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {cat.label}
              </h1>
            </RevealWrapper>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, i) => (
                <RevealWrapper key={product.id} delay={i * 70}>
                  <ProductCard
                    id={product.id}
                    slug={product.slug}
                    category={product.category}
                    name={product.name}
                    tagline={product.tagline}
                    thumbnail={product.thumbnail}
                    price={product.price}
                    priceUnit={product.priceUnit}
                  />
                </RevealWrapper>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <FloatingContact />
    </>
  )
}
