import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductBySlug, productCategories, products } from '@/data/products'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL, SITE_NAME } from '@/lib/utils'
import ProductInteractive from './ProductInteractive'

interface Props {
  params: Promise<{ category: string; slug: string }>
}

export function generateStaticParams() {
  return products.map((p) => ({ category: p.category, slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, category } = await params
  const product = getProductBySlug(slug)
  if (!product) {
    return buildMetadata({ title: 'Товар не найден', noIndex: true, path: `/catalog/${category}/${slug}` })
  }

  const cat = productCategories.find((c) => c.slug === product.category)
  const descriptionBase = product.tagline + '. ' + product.description
  const description = descriptionBase.length > 160
    ? descriptionBase.slice(0, 157) + '...'
    : descriptionBase

  return buildMetadata({
    title: `${product.name} — цена, характеристики, применение`,
    description,
    path: `/catalog/${product.category}/${slug}`,
    image: product.images[0] ?? undefined,
  })
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const cat = productCategories.find((c) => c.slug === product.category)
  const related = products.filter((p) => product.relatedIds.includes(p.id))

  const productUrl = `${SITE_URL}/catalog/${product.category}/${product.slug}`

  // Schema.org: Product or Service
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': product.category === 'services' ? 'Service' : 'Product',
    '@id': productUrl,
    name: product.name,
    description: product.description,
    image: product.images[0]
      ? (product.images[0].startsWith('http') ? product.images[0] : `${SITE_URL}${product.images[0]}`)
      : `${SITE_URL}/images/og/default.jpg`,
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'RUB',
      price: String(product.price),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      availability: 'https://schema.org/InStock',
      url: productUrl,
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    ...(product.category !== 'services' && {
      category: cat?.label ?? '',
      additionalProperty: product.specs.map((spec) => ({
        '@type': 'PropertyValue',
        name: spec.label,
        value: spec.value,
      })),
    }),
  }

  // Schema.org: BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: `${SITE_URL}/catalog` },
      {
        '@type': 'ListItem',
        position: 3,
        name: cat?.label ?? product.category,
        item: `${SITE_URL}/catalog/${product.category}`,
      },
      { '@type': 'ListItem', position: 4, name: product.name, item: productUrl },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductInteractive product={product} cat={cat} related={related} />
    </>
  )
}
