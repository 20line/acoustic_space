import Link from 'next/link'
import Image from 'next/image'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { productCategories } from '@/data/products'

const solutionItems = [
  {
    slug: 'slatted',
    title: 'Реечные',
    desc: 'Шпон · массив · тёплая фактура',
    bgClass: 'seg-bg-2',
    image: '/images/catalog/slatted/oak-natural-thumb.jpg',
  },
  {
    slug: 'fabric',
    title: 'Тканевые',
    desc: 'Широкополосное поглощение',
    bgClass: 'seg-bg-5',
    image: '/images/catalog/fabric/graphite-thumb.jpg',
  },
  {
    slug: 'artistic',
    title: 'Художественные',
    desc: 'Рельеф-диффузоры как арт-объект',
    bgClass: 'seg-bg-1',
    image: '/images/catalog/artistic/relief-thumb.jpg',
  },
]

export function SolutionsSection() {
  return (
    <section
      className="pad border-t border-b"
      id="solutions"
      style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}
    >
      <div className="wrap">
        <RevealWrapper className="sec-head">
          <span className="eyebrow">Наши акустические решения</span>
          <h2
            className="sec-h text-[clamp(34px,4.8vw,58px)]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Панели, рассчитанные под звук
          </h2>
          <p>
            Не просто «декор на стену», а инструменты управления акустикой — под конкретную задачу и интерьер.
          </p>
        </RevealWrapper>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {solutionItems.map((item, i) => (
            <RevealWrapper key={item.slug} delay={i * 80}>
              <Link
                href={`/catalog/${item.slug}`}
                className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[8px] shadow-premium"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.06]"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMyIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM3YTVhM2MiLz48L3N2Zz4="
                  sizes="(max-width:640px) 100vw, 33vw"
                />
                {/* Fallback bg */}
                <div className={`absolute inset-0 -z-10 ${item.bgClass}`} aria-hidden />
                {/* Gradient overlay */}
                <div className="absolute inset-0 gradient-bottom" aria-hidden />
                {/* Text */}
                <div className="relative z-10 p-6 text-white">
                  <h3
                    className="text-[26px] font-semibold"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[13px]" style={{ color: 'rgba(255,255,255,0.82)' }}>
                    {item.desc}
                  </p>
                </div>
              </Link>
            </RevealWrapper>
          ))}
        </div>

        <RevealWrapper className="mt-11 text-center">
          <Link href="/catalog" className="btn btn-out">
            Все решения
          </Link>
        </RevealWrapper>
      </div>
    </section>
  )
}
