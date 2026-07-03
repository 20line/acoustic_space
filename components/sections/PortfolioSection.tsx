import Link from 'next/link'
import Image from 'next/image'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { portfolioProjects } from '@/data/portfolio'

export function PortfolioSection() {
  const featured = portfolioProjects.slice(0, 3)

  const categoryLabels: Record<string, string> = {
    studio: 'Студия',
    'home-theater': 'Кинотеатр',
    hifi: 'Hi-Fi',
    office: 'Офис',
    restaurant: 'Ресторан',
    rehearsal: 'Репетиционная',
  }

  return (
    <section className="pad" id="portfolio">
      <div className="wrap">
        <RevealWrapper className="sec-head">
          <span className="eyebrow">Галерея проектов</span>
          <h2
            className="sec-h text-[clamp(34px,4.8vw,58px)]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Последние объекты
          </h2>
          <p>Студии, кинозалы и комнаты прослушивания, где звук стал частью архитектуры.</p>
        </RevealWrapper>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <RevealWrapper key={project.id} delay={i * 80}>
              <Link
                href={`/portfolio/${project.slug}`}
                className="group block overflow-hidden rounded-[8px] shadow-premium"
                style={{ background: 'var(--cream-2)' }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.06]"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSIzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM3YTVhM2MiLz48L3N2Zz4="
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  />
                  {/* Fallback */}
                  <div className="absolute inset-0 -z-10 seg-bg-2" aria-hidden />
                  <span
                    className="absolute bottom-3 left-3.5 rounded px-2 py-1 text-[10px] tracking-[0.14em] uppercase"
                    style={{ color: 'rgba(255,255,255,0.6)', background: 'rgba(0,0,0,0.22)' }}
                  >
                    фото · интерьер
                  </span>
                </div>

                {/* Meta */}
                <div className="p-6">
                  <span
                    className="text-[11px] font-semibold tracking-[0.14em] uppercase"
                    style={{ color: 'var(--accent)' }}
                  >
                    {categoryLabels[project.category] ?? project.category} · {project.location}
                  </span>
                  <h3
                    className="mt-2 mb-1 text-[24px] font-semibold"
                    style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
                  >
                    {project.title}
                  </h3>
                  <p className="text-[13px]" style={{ color: 'var(--muted)' }}>
                    {project.description.slice(0, 100)}…
                  </p>
                </div>
              </Link>
            </RevealWrapper>
          ))}
        </div>

        <RevealWrapper className="mt-11 text-center">
          <Link href="/portfolio" className="btn btn-out">
            Всё портфолио
          </Link>
        </RevealWrapper>
      </div>
    </section>
  )
}
