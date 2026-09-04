import Link from 'next/link'
import { FOOTER_LINKS } from '@/constants'
import { CONTACTS } from '@/lib/contacts'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="border-t"
      style={{ background: 'var(--cream-2)', borderColor: 'var(--line)', paddingTop: '72px', paddingBottom: '36px' }}
    >
      <div className="wrap">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1.1fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-[30px] font-semibold tracking-[0.18em]"
              style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
            >
              ACOUSTIC SPACE
            </Link>
            <p className="mt-3 max-w-[250px] text-[13px]" style={{ color: 'var(--muted)' }}>
              Премиальные акустические панели: расчёт, производство и монтаж решений для звука.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <SocialLink href={CONTACTS.telegram} label="Telegram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.448 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.547l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.978.012z" />
                </svg>
              </SocialLink>
              <SocialLink href={CONTACTS.whatsapp} label="WhatsApp">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </SocialLink>
              <SocialLink href={process.env.NEXT_PUBLIC_VK ?? '#'} label="ВКонтакте">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 3.827 8.992 3.827 8.55c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.814-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.339-.491.763-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.745-.576.745z" />
                </svg>
              </SocialLink>
              <SocialLink href={process.env.NEXT_PUBLIC_YOUTUBE ?? '#'} label="YouTube">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088C19.588 3.5 12 3.5 12 3.5s-7.588 0-9.407.617A3.007 3.007 0 00.505 6.205 31.247 31.247 0 000 12a31.247 31.247 0 00.505 5.795 3.007 3.007 0 002.088 2.088C4.412 20.5 12 20.5 12 20.5s7.588 0 9.407-.617a3.007 3.007 0 002.088-2.088A31.247 31.247 0 0024 12a31.247 31.247 0 00-.505-5.795zM9.609 15.601V8.408l6.264 3.602z" />
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="eyebrow mb-4">Решения</h4>
            <ul className="flex flex-col gap-0.5">
              {FOOTER_LINKS.solutions.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block py-1.5 text-[14px] transition-all duration-200 hover:text-accent"
                    style={{ color: 'var(--ink)', opacity: 0.8 }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Segments */}
          <div>
            <h4 className="eyebrow mb-4">Для кого</h4>
            <ul className="flex flex-col gap-0.5">
              {FOOTER_LINKS.segments.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block py-1.5 text-[14px] transition-all duration-200 hover:text-accent"
                    style={{ color: 'var(--ink)', opacity: 0.8 }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="eyebrow mb-4">Инструменты</h4>
            <ul className="flex flex-col gap-0.5">
              {(FOOTER_LINKS.tools ?? []).map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block py-1.5 text-[14px] transition-all duration-200 hover:text-accent"
                    style={{ color: 'var(--ink)', opacity: 0.8 }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="eyebrow mb-4">Компания</h4>
            <ul className="flex flex-col gap-0.5">
              {FOOTER_LINKS.company.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block py-1.5 text-[14px] transition-all duration-200 hover:text-accent"
                    style={{ color: 'var(--ink)', opacity: 0.8 }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="eyebrow mb-4">Контакты</h4>
            <div className="flex flex-col gap-1.5">
              <a
                href={`tel:${CONTACTS.phone}`}
                className="text-[15px] transition-colors hover:text-accent"
                style={{ color: 'var(--ink)' }}
              >
                {CONTACTS.phoneDisplay}
              </a>
              <a
                href={`mailto:${CONTACTS.email}`}
                className="text-[14px] transition-colors hover:text-accent"
                style={{ color: 'var(--ink)' }}
              >
                {CONTACTS.email}
              </a>
              <div className="mt-2 flex flex-col gap-1">
                <a href={CONTACTS.telegram} target="_blank" rel="noopener noreferrer" className="text-[12px] hover:text-accent" style={{ color: 'var(--muted)' }}>
                  Telegram {CONTACTS.telegramHandle}
                </a>
                <a href={CONTACTS.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[12px] hover:text-accent" style={{ color: 'var(--muted)' }}>
                  WhatsApp
                </a>
                <span className="mt-1 text-[12px]" style={{ color: 'var(--muted)' }}>
                  Шоурум и производство
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-14 flex flex-wrap items-center justify-between gap-2 border-t pt-6 text-[12px]"
          style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
        >
          <span>© {year} ACOUSTIC SPACE · Акустические панели премиум-класса</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-accent">Политика конфиденциальности</Link>
            <Link href="/consent" className="hover:text-accent">Согласие на обработку ПДн</Link>
            <Link href="/terms" className="hover:text-accent">Публичная оферта</Link>
            <Link href="/sitemap.xml" className="hover:text-accent">Карта сайта</Link>
          </div>
          <span>тишина и стиль</span>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 hover:border-[var(--taupe)] hover:text-accent"
      style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
    >
      {children}
    </a>
  )
}
