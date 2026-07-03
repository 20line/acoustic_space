import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Preloader } from '@/components/ui/Preloader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { BackToTop } from '@/components/ui/BackToTop'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { ProductCardsSection } from '@/components/sections/ProductCardsSection'
import { AdvantagesSection } from '@/components/sections/AdvantagesSection'
import { SolutionsSection } from '@/components/sections/SolutionsSection'
import { SegmentsSection } from '@/components/sections/SegmentsSection'
import { PortfolioSection } from '@/components/sections/PortfolioSection'
import { ClientsSection } from '@/components/sections/ClientsSection'
import { ReviewsSection } from '@/components/sections/ReviewsSection'
import { ProductionSection } from '@/components/sections/ProductionSection'
import { CtaBandSection } from '@/components/sections/CtaBandSection'
import LenisProvider from '@/components/providers/LenisProvider'
import { SITE_URL, SITE_NAME } from '@/lib/utils'

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'ru-RU',
  publisher: {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Preloader />
      <ProgressBar />
      <LenisProvider />

      <Header transparent />
      <main>
        <HeroSection />
        <AboutSection />
        <ProductCardsSection />
        <AdvantagesSection />
        <SolutionsSection />
        <SegmentsSection />
        <PortfolioSection />
        <ClientsSection />
        <ReviewsSection />
        <ProductionSection />
        <CtaBandSection />
      </main>
      <Footer />

      <BackToTop />
      <FloatingContact />
    </>
  )
}
