import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME } from './utils'

interface PageMetaOptions {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
  path?: string
}

export function buildMetadata({
  title,
  description = 'Премиальные акустические панели: реечные, тканевые и художественные. Тишина и стиль для вашего пространства — расчёт, производство, монтаж.',
  image = '/images/og/default.jpg',
  noIndex = false,
  path = '',
}: PageMetaOptions = {}): Metadata {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} · Акустические панели премиум-класса`
  const url = `${SITE_URL}${path}`
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'ru_RU',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  }
}

export const defaultStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE_NAME,
  description: 'Производство и монтаж премиальных акустических панелей',
  url: SITE_URL,
  telephone: process.env.NEXT_PUBLIC_PHONE ?? '+79777903983',
  email: process.env.NEXT_PUBLIC_EMAIL ?? 'hello@akusto.ru',
  address: {
    '@type': 'PostalAddress',
    addressLocality: process.env.NEXT_PUBLIC_CITY ?? 'Москва',
    addressCountry: 'RU',
    streetAddress: process.env.NEXT_PUBLIC_ADDRESS ?? '',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '19:00',
    },
  ],
  priceRange: '₽₽₽',
  currenciesAccepted: 'RUB',
  paymentAccepted: 'Cash, Bank Transfer',
  areaServed: 'RU',
  '@id': SITE_URL,
  sameAs: [
    process.env.NEXT_PUBLIC_TELEGRAM ?? '',
    process.env.NEXT_PUBLIC_WHATSAPP ?? '',
  ].filter(Boolean),
}
