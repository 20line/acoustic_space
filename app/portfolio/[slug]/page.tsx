import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { CtaBandSection } from '@/components/sections/CtaBandSection'
import { getProjectBySlug, portfolioProjects } from '@/data/portfolio'
import { products } from '@/data/products'
import { ProductCard } from '@/components/catalog/ProductCard'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL, SITE_NAME } from '@/lib/utils'
import { Phone, Ruler } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return portfolioProjects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}
  return buildMetadata({
    title: project.title,
    description: project.description.slice(0, 160),
    path: `/portfolio/${slug}`,
  })
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    url: `${SITE_URL}/portfolio/${slug}`,
    image: project.images?.[0] ?? project.thumbnail,
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    locationCreated: {
      '@type': 'Place',
      name: project.location,
      addressCountry: 'RU',
    },
  }

  const categoryLabels: Record<string, string> = {
    studio: 'Студия', 'home-theater': 'Кинотеатр', hifi: 'Hi-Fi', office: 'Офис', restaurant: 'Ресторан', rehearsal: 'Репетиционная',
  }

  return (
    <>
      <ProgressBar />
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <main className="pt-24">
        <div className="wrap py-4">
          <nav className="flex gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <Link href="/portfolio" className="hover:text-accent">Портфолио</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>{project.title}</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="pad pt-8">
          <div className="wrap">
            <RevealWrapper className="max-w-[760px] mb-12">
              <span className="eyebrow block mb-4">
                {categoryLabels[project.category]} · {project.location} · {project.year}
              </span>
              <h1 className="text-[clamp(32px,4.5vw,58px)] font-semibold leading-tight" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {project.title}
              </h1>
              <p className="mt-4 text-[17px]" style={{ color: 'var(--muted)' }}>{project.description}</p>
            </RevealWrapper>

            {/* Images grid */}
            <RevealWrapper>
              <div className={`grid gap-3 ${project.images.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                {project.images.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    className={`relative overflow-hidden rounded-xl shadow-premium ${i === 0 ? 'sm:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'}`}
                  >
                    <Image
                      src={img}
                      alt={`${project.title} — фото ${i + 1}`}
                      fill
                      className="object-cover"
                      priority={i === 0}
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM3YTVhM2MiLz48L3N2Zz4="
                      sizes="(max-width:640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 -z-10 seg-bg-2" aria-hidden />
                  </div>
                ))}
              </div>
            </RevealWrapper>
          </div>
        </section>

        {/* Details */}
        <section className="pad border-t" style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}>
          <div className="wrap">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-3">
              {/* Project info */}
              <div className="lg:col-span-2">
                <RevealWrapper>
                  <h2 className="text-[clamp(26px,3vw,38px)] font-semibold mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    Задача и решение
                  </h2>
                  <div className="flex flex-col gap-6">
                    <div className="rounded-xl p-6" style={{ background: 'var(--cream)' }}>
                      <h3 className="text-[14px] font-semibold tracking-[0.08em] uppercase mb-3" style={{ color: 'var(--accent)' }}>Задача</h3>
                      <p className="text-[15px] leading-relaxed" style={{ color: 'var(--ink)' }}>{project.challenge}</p>
                    </div>
                    <div className="rounded-xl p-6" style={{ background: 'var(--cream)' }}>
                      <h3 className="text-[14px] font-semibold tracking-[0.08em] uppercase mb-3" style={{ color: 'var(--accent)' }}>Решение</h3>
                      <p className="text-[15px] leading-relaxed" style={{ color: 'var(--ink)' }}>{project.solution}</p>
                    </div>
                    <div className="rounded-xl p-6" style={{ background: 'var(--cream)' }}>
                      <h3 className="text-[14px] font-semibold tracking-[0.08em] uppercase mb-3" style={{ color: 'var(--accent)' }}>Результат</h3>
                      <p className="text-[15px] leading-relaxed" style={{ color: 'var(--ink)' }}>{project.result}</p>
                    </div>
                  </div>
                </RevealWrapper>
              </div>

              {/* Sidebar */}
              <RevealWrapper delay={100}>
                <div className="rounded-xl p-6" style={{ background: 'var(--cream)', border: '1px solid var(--line)' }}>
                  <h3 className="text-[14px] font-semibold tracking-[0.08em] uppercase mb-5" style={{ color: 'var(--muted)' }}>
                    Параметры объекта
                  </h3>
                  <div className="flex flex-col gap-3">
                    <InfoRow label="Площадь" value={`${project.area} м²`} />
                    <InfoRow label="Тип" value={categoryLabels[project.category]} />
                    <InfoRow label="Город" value={project.location} />
                    <InfoRow label="Год" value={String(project.year)} />
                  </div>
                  <div className="mt-6">
                    <h4 className="text-[12px] tracking-[0.1em] uppercase mb-3" style={{ color: 'var(--muted)' }}>Панели</h4>
                    <div className="flex flex-col gap-1.5">
                      {project.panelsUsed.map((p) => (
                        <span key={p} className="text-[13px]" style={{ color: 'var(--ink)' }}>· {p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </RevealWrapper>
            </div>
          </div>
        </section>

        {/* CTA: Acoustic Measurement */}
        <section className="pad border-t" style={{ borderColor: 'var(--line)', background: 'var(--walnut)' }}>
          <div className="wrap">
            <RevealWrapper>
              <div className="flex flex-col items-center text-center text-white">
                <Ruler size={36} className="mb-4 opacity-80" />
                <h2
                  className="text-[clamp(26px,3.5vw,42px)] font-semibold mb-3"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  Хотите такой же результат?
                </h2>
                <p className="max-w-[520px] mb-8 text-[15px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  Закажите акустический замер — наш инженер приедет, проведёт измерения и подберёт оптимальное решение для вашего помещения.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/contacts"
                    className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[14px] font-semibold transition-transform hover:scale-[1.03]"
                    style={{ background: '#fff', color: 'var(--walnut)' }}
                  >
                    <Ruler size={16} />
                    Заказать замер
                  </Link>
                  <a
                    href="tel:+74951234567"
                    className="inline-flex items-center gap-2 rounded-full border px-8 py-3.5 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03]"
                    style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    <Phone size={16} />
                    Позвонить инженеру
                  </a>
                </div>
              </div>
            </RevealWrapper>
          </div>
        </section>

        {/* Related Products */}
        {(() => {
          const related = products.filter((p) =>
            p.usageScenarios?.includes(project.category)
          ).slice(0, 3)
          if (related.length === 0) return null
          return (
            <section className="pad border-t" style={{ borderColor: 'var(--line)' }}>
              <div className="wrap">
                <RevealWrapper className="mb-10">
                  <span className="eyebrow block mb-3">Использованные решения</span>
                  <h2
                    className="text-[clamp(26px,3.5vw,42px)] font-semibold"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    Продукция из каталога
                  </h2>
                </RevealWrapper>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((p) => (
                    <RevealWrapper key={p.id}>
                      <ProductCard
                        id={p.id}
                        slug={p.slug}
                        category={p.category}
                        name={p.name}
                        tagline={p.tagline}
                        thumbnail={p.thumbnail}
                        price={p.price}
                        priceUnit={p.priceUnit}
                        size="small"
                      />
                    </RevealWrapper>
                  ))}
                </div>
                <RevealWrapper className="mt-10 text-center">
                  <Link href="/catalog" className="btn btn-out">
                    Весь каталог
                  </Link>
                </RevealWrapper>
              </div>
            </section>
          )
        })()}

        <CtaBandSection />
      </main>
      <Footer />
      <BackToTop />
      <FloatingContact />
    </>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b text-[14px]" style={{ borderColor: 'var(--line)' }}>
      <span style={{ color: 'var(--muted)' }}>{label}</span>
      <span className="font-semibold" style={{ color: 'var(--ink)' }}>{value}</span>
    </div>
  )
}
