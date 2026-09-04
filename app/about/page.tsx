import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { CtaBandSection } from '@/components/sections/CtaBandSection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { STATS } from '@/constants'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL, SITE_NAME } from '@/lib/utils'
import { CONTACTS } from '@/lib/contacts'

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  foundingDate: '2010',
  description: 'Производство и монтаж премиальных акустических панелей в России',
  telephone: CONTACTS.phone,
  email: CONTACTS.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Москва',
    addressCountry: 'RU',
  },
  sameAs: [CONTACTS.telegram],
}

export const metadata: Metadata = buildMetadata({
  title: 'О компании',
  description: 'Акустическое зодчество с 2010 года. Производство и монтаж премиальных акустических панелей в России.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <ProgressBar />
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <main className="pt-24">
        <div className="wrap py-4">
          <nav className="flex gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>О компании</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="pad pt-8">
          <div className="wrap">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 items-center">
              <RevealWrapper>
                <span className="eyebrow block mb-4">О компании</span>
                <h1 className="text-[clamp(36px,5vw,64px)] font-semibold leading-tight mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Акустическое зодчество
                </h1>
                <div className="text-[16px] leading-relaxed flex flex-col gap-4 max-w-[520px]" style={{ color: 'var(--muted)' }}>
                  <p>
                    ACOUSTIC SPACE — производственная компания по проектированию и изготовлению премиальных акустических панелей. Работаем с 2010 года.
                  </p>
                  <p>
                    Мы относимся к акустике как к архитектуре. Каждое изделие рассчитано под геометрию, материалы и назначение помещения — диффузия, поглощение и контроль низких частот не «на глаз», а по измерениям.
                  </p>
                  <p>
                    Всё производство находится в России. Мы контролируем каждый этап — от подбора материалов до контрольного измерения после монтажа.
                  </p>
                </div>
              </RevealWrapper>

              <RevealWrapper>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-premium">
                  <Image
                    src="/images/about/team.jpg"
                    alt="Команда ACOUSTIC SPACE"
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM4NjU5M2EiLz48L3N2Zz4="
                    sizes="(max-width:1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 -z-10" style={{ background: 'repeating-linear-gradient(90deg,#86593a 0 16px,#6f4830 16px 19px,#9a6c45 19px 35px,#5d3c25 35px 38px)' }} />
                </div>
              </RevealWrapper>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="pad border-t border-b" style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}>
          <div className="wrap">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {STATS.map((stat, i) => (
                <RevealWrapper key={stat.value} delay={i * 80}>
                  <div className="text-[48px] leading-none font-semibold" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--walnut)' }}>
                    {stat.value}
                  </div>
                  <h4 className="mt-3 mb-1 text-[16px] font-semibold">{stat.label}</h4>
                  <p className="text-[14px]" style={{ color: 'var(--muted)' }}>{stat.description}</p>
                </RevealWrapper>
              ))}
            </div>
          </div>
        </section>

        {/* Workshop */}
        <section className="pad">
          <div className="wrap">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 items-center">
              <RevealWrapper className="order-last lg:order-first">
                <div className="grid grid-cols-2 gap-3">
                  {['/images/about/workshop.jpg', '/images/about/workshop-2.jpg', '/images/about/materials.jpg', '/images/about/detail.jpg'].map((src, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                      <Image src={src} alt={`Производство ${i + 1}`} fill className="object-cover"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM3YzUyMzIiLz48L3N2Zz4="
                        sizes="25vw" />
                      <div className="absolute inset-0 -z-10 tex-walnut" />
                    </div>
                  ))}
                </div>
              </RevealWrapper>
              <RevealWrapper delay={100}>
                <span className="eyebrow block mb-4">Производство</span>
                <h2 className="text-[clamp(28px,4vw,48px)] font-semibold leading-tight mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Собственный
                  <br />производственный участок
                </h2>
                <div className="text-[16px] leading-relaxed flex flex-col gap-4 max-w-[480px]" style={{ color: 'var(--muted)' }}>
                  <p>Изготавливаем панели на собственном производственном участке. Контролируем качество материалов, точность геометрии и соблюдение акустических параметров на каждом этапе.</p>
                  <p>Используем профессиональные наполнители с сертифицированными акустическими характеристиками. Для лицевых поверхностей — натуральные материалы ведущих европейских производителей.</p>
                </div>
              </RevealWrapper>
            </div>
          </div>
        </section>

        <ProcessSection />
        <CtaBandSection />
      </main>
      <Footer />
      <BackToTop />
      <FloatingContact />
    </>
  )
}
