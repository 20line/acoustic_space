import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { CtaBandSection } from '@/components/sections/CtaBandSection'
import { faqItems } from '@/data/faq'
import { buildMetadata } from '@/lib/metadata'
import { FaqInteractive } from './FaqInteractive'

export const metadata: Metadata = buildMetadata({
  title: 'Часто задаваемые вопросы об акустике — FAQ',
  description: 'Ответы на частые вопросы об акустических панелях, звукоизоляции, проектировании и стоимости работ. Всё что нужно знать перед заказом.',
  path: '/faq',
})

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

export default function FaqPage() {
  return (
    <>
      <ProgressBar />
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="pt-24">
        <div className="wrap py-4">
          <nav className="flex gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>FAQ</span>
          </nav>
        </div>

        <section className="pad pt-8">
          <div className="wrap">
            <RevealWrapper className="max-w-[660px] mb-12">
              <span className="eyebrow block mb-4">Часто задаваемые вопросы</span>
              <h1
                className="text-[clamp(32px,4.5vw,56px)] font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                Ответы на ваши вопросы
              </h1>
            </RevealWrapper>

            <FaqInteractive items={faqItems} />
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
