import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { ContactForm } from '@/components/ui/ContactForm'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL, SITE_NAME } from '@/lib/utils'
import { CONTACTS } from '@/lib/contacts'

export const metadata: Metadata = buildMetadata({
  title: 'Контакты',
  description: 'Свяжитесь с нами для расчёта акустического проекта. Замер, производство и монтаж премиальных акустических панелей.',
  path: '/contacts',
})

export default function ContactsPage() {
  const phone = CONTACTS.phoneDisplay
  const email = CONTACTS.email
  const telegram = CONTACTS.telegram
  const whatsapp = CONTACTS.whatsapp

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Контакты — ${SITE_NAME}`,
    url: `${SITE_URL}/contacts`,
    mainEntity: {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      telephone: phone,
      email: email,
      url: SITE_URL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: process.env.NEXT_PUBLIC_CITY ?? 'Москва',
        addressCountry: 'RU',
        streetAddress: process.env.NEXT_PUBLIC_ADDRESS ?? 'ул. Производственная, 12с3',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '10:00',
          closes: '19:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday'],
          opens: '11:00',
          closes: '16:00',
        },
      ],
      sameAs: [telegram, whatsapp].filter((v) => v && v !== '#'),
    },
  }

  return (
    <>
      <ProgressBar />
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <main className="pt-24">
        <div className="wrap py-4">
          <nav className="flex gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>Контакты</span>
          </nav>
        </div>

        <section className="pad pt-8">
          <div className="wrap">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
              <RevealWrapper>
                <span className="eyebrow block mb-4">Контакты</span>
                <h1 className="text-[clamp(32px,4.5vw,56px)] font-semibold leading-tight mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Рассчитаем проект
                  <br />вместе
                </h1>
                <p className="text-[16px] mb-10 max-w-[420px]" style={{ color: 'var(--muted)' }}>
                  Расскажите о помещении — подготовим предварительный акустический расчёт и подберём оптимальное решение.
                </p>

                <div className="flex flex-col gap-5">
                  <ContactItem
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.77 19.79 19.79 0 012 1.18 2 2 0 014 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14z" /></svg>}
                    label="Телефон"
                    value={phone}
                    href={`tel:${CONTACTS.phone}`}
                  />
                  <ContactItem
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>}
                    label="Email"
                    value={email}
                    href={`mailto:${email}`}
                  />
                  <ContactItem
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.448 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.547l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.978.012z" /></svg>}
                    label="Telegram"
                    value={CONTACTS.telegramHandle}
                    href={telegram}
                    external
                  />
                  <ContactItem
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>}
                    label="WhatsApp"
                    value="Написать в WhatsApp"
                    href={whatsapp}
                    external
                  />
                </div>
              </RevealWrapper>

              <RevealWrapper delay={100}>
                <div
                  className="rounded-2xl p-8 shadow-premium"
                  style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}
                >
                  <h2 className="text-[26px] font-semibold mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    Отправить заявку
                  </h2>
                  <ContactForm />
                </div>
              </RevealWrapper>
            </div>
          </div>
        </section>

        {/* Address & Map */}
        <section className="pad border-t" style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}>
          <div className="wrap">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              <RevealWrapper>
                <span className="eyebrow block mb-6">Где нас найти</span>
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full" style={{ background: 'var(--sand)', color: 'var(--muted)' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    </div>
                    <div>
                      <p className="text-[11px] tracking-[0.1em] uppercase mb-1" style={{ color: 'var(--muted)' }}>Шоурум и производство</p>
                      <p className="text-[15px] font-medium" style={{ color: 'var(--ink)' }}>Москва, ул. Производственная, 12с3</p>
                      <p className="text-[13px] mt-0.5" style={{ color: 'var(--muted)' }}>Пн–Пт 10:00–19:00, Сб 11:00–16:00</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full" style={{ background: 'var(--sand)', color: 'var(--muted)' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                    </div>
                    <div>
                      <p className="text-[11px] tracking-[0.1em] uppercase mb-1" style={{ color: 'var(--muted)' }}>Реквизиты</p>
                      <p className="text-[14px] font-medium" style={{ color: 'var(--ink)' }}>ООО «ACOUSTIC SPACE»</p>
                      <p className="text-[13px]" style={{ color: 'var(--muted)' }}>ИНН 7700000000 / ОГРН 1000000000000</p>
                    </div>
                  </div>
                </div>
              </RevealWrapper>
              <RevealWrapper delay={100}>
                <div className="relative h-[320px] overflow-hidden rounded-xl shadow-premium flex flex-col items-center justify-center gap-4 text-center px-8" style={{ background: 'var(--sand)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  <p className="text-[14px]" style={{ color: 'var(--muted)' }}>Карта отображается после подтверждения cookies</p>
                  <a href="https://yandex.ru/maps/" target="_blank" rel="noopener noreferrer" className="btn btn-outline text-[13px]" style={{ padding: '8px 18px' }}>
                    Открыть в Яндекс.Картах
                  </a>
                </div>
              </RevealWrapper>
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

function ContactItem({
  icon, label, value, href, external,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href: string
  external?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group flex items-center gap-4 rounded-xl border p-4 transition-all duration-200 hover:border-[var(--taupe)] hover:shadow-card"
      style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
    >
      <div
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition-colors group-hover:text-accent"
        style={{ background: 'var(--sand)', color: 'var(--muted)' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[11px] tracking-[0.1em] uppercase mb-0.5" style={{ color: 'var(--muted)' }}>{label}</p>
        <p className="text-[15px] font-medium">{value}</p>
      </div>
    </a>
  )
}
