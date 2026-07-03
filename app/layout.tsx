import type { Metadata, Viewport } from 'next'
import { cormorant, manrope, montserrat } from '@/lib/fonts'
import { buildMetadata, defaultStructuredData } from '@/lib/metadata'
import { CartProvider } from '@/context/CartContext'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { NextAuthProvider } from '@/providers/NextAuthProvider'
import { CookieBanner } from '@/components/ui/CookieBanner'
import '@/styles/globals.css'

export const metadata: Metadata = {
  ...buildMetadata(),
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    types: {
      'application/rss+xml': [
        { url: '/blog/rss.xml', title: 'ACOUSTIC SPACE — Блог об акустике' },
      ],
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F7F2EA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${cormorant.variable} ${manrope.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(defaultStructuredData) }}
        />
      </head>
      <body className="bg-cream text-ink antialiased">
          <NextAuthProvider>
            <CartProvider>
              {children}
              <CartDrawer />
              <CookieBanner />
            </CartProvider>
          </NextAuthProvider>
        </body>
    </html>
  )
}
