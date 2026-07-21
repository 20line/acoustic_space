'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, FileText, Plus, Minus, Heart, Star } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { Modal } from '@/components/ui/Modal'
import { ContactForm } from '@/components/ui/ContactForm'
import { useCart } from '@/context/CartContext'
import { useSession } from 'next-auth/react'
import type { Product } from '@/types'
import type { productCategories } from '@/data/products'

type Category = typeof productCategories[number]

const USAGE_SCENARIOS = [
  { slug: 'home-theater', label: 'Домашний кинотеатр', tags: ['реечные', 'дерево', 'шпон', 'диффузор', 'QRD', 'басовые ловушки', 'низкие частоты', 'home-theater'] },
  { slug: 'studio', label: 'Студия звукозаписи', tags: ['ткань', 'поглощение', 'широкополосные', 'басовые ловушки', 'низкие частоты', 'диффузоры', 'QRD', 'studio'] },
  { slug: 'hifi', label: 'Hi-Fi комната', tags: ['реечные', 'дерево', 'шпон', 'диффузор', 'QRD', 'художественные', 'арт-объект', 'басовые ловушки', 'hifi'] },
  { slug: 'office', label: 'Офисы и переговорные', tags: ['ткань', 'поглощение', 'широкополосные', 'реечные', 'office'] },
  { slug: 'restaurant', label: 'Рестораны и lounge', tags: ['диффузор', 'QRD', 'художественные', 'арт-объект', 'дерево', 'реечные', 'restaurant'] },
  { slug: 'rehearsal', label: 'Репетиционные базы', tags: ['ткань', 'поглощение', 'широкополосные', 'басовые ловушки', 'низкие частоты', 'rehearsal'] },
]

interface Props {
  product: Product
  cat: Category | undefined
  related: Product[]
}

export default function ProductInteractive({ product, cat, related }: Props) {
  const [activeImage, setActiveImage] = useState(0)
  const [contactOpen, setContactOpen] = useState(false)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [colorsExpanded, setColorsExpanded] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewSent, setReviewSent] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviews, setReviews] = useState<Array<{ id: string; name: string; rating: number; text: string; createdAt: string }>>([])
  const { addItem } = useCart()
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      fetch('/api/wishlist')
        .then((r) => r.json())
        .then((ids: string[]) => setWishlisted(ids.includes(product.id)))
        .catch(() => {})
    }
    fetch(`/api/reviews?productId=${product.id}`)
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => {})
  }, [session, product.id])

  const toggleWishlist = useCallback(async () => {
    if (!session) return
    const res = await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id }),
    })
    const data = await res.json()
    setWishlisted(data.wishlisted)
  }, [session, product.id])

  const submitReview = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setReviewError('')
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, name: reviewName, rating: reviewRating, text: reviewText }),
    })
    if (!res.ok) {
      setReviewError('Не удалось отправить отзыв. Попробуйте позже.')
      return
    }
    setReviewSent(true)
  }, [product.id, reviewName, reviewRating, reviewText])

  const gallery = [product.thumbnail, ...product.images.filter(img => img !== product.thumbnail)]

  const handleAddToCart = useCallback(async () => {
    await addItem({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price * 100,
      quantity: qty,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }, [addItem, product, qty])

  const matchedScenarios = USAGE_SCENARIOS.filter((s) =>
    (product.usageScenarios ?? product.tags).some((t) => s.tags.includes(t))
  )

  return (
    <>
      <ProgressBar />
      <Header />
      <main className="pt-24">
        {/* Breadcrumb */}
        <div className="wrap py-4">
          <nav className="flex flex-wrap gap-2 text-[13px]" style={{ color: 'var(--muted)' }} aria-label="Хлебные крошки">
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span aria-hidden>/</span>
            <Link href="/catalog" className="hover:text-accent">Каталог</Link>
            <span aria-hidden>/</span>
            <Link href={`/catalog/${product.category}`} className="hover:text-accent">{cat?.label}</Link>
            <span aria-hidden>/</span>
            <span style={{ color: 'var(--ink)' }}>{product.name}</span>
          </nav>
        </div>

        {/* Product detail */}
        <section className="pad pt-8">
          <div className="wrap">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_1fr]">
              {/* Gallery */}
              <RevealWrapper>
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-premium">
                    <Image
                      src={gallery[activeImage] ?? product.thumbnail}
                      alt={product.name}
                      fill
                      priority
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM3YzUyMzIiLz48L3N2Zz4="
                      sizes="(max-width:1024px) 100vw, 55vw"
                    />
                    <div className="absolute inset-0 -z-10 tex-walnut" />
                  </div>
                  {gallery.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-1" role="list" aria-label="Галерея">
                      {gallery.map((img, i) => (
                        <button
                          key={i}
                          role="listitem"
                          onClick={() => setActiveImage(i)}
                          aria-label={`Фото ${i + 1}`}
                          aria-pressed={activeImage === i}
                          className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-200 ${
                            activeImage === i ? 'ring-2 ring-[var(--accent)]' : 'opacity-60 hover:opacity-100'
                          }`}
                        >
                          <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="112px" />
                          <div className="absolute inset-0 -z-10 tex-walnut" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </RevealWrapper>

              {/* Info */}
              <RevealWrapper delay={100}>
                <span className="eyebrow block mb-3">{cat?.label}</span>
                <h1
                  className="text-[clamp(28px,4vw,48px)] font-semibold leading-tight mb-3"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {product.name}
                </h1>
                <p className="text-[16px] mb-6" style={{ color: 'var(--muted)' }}>{product.tagline}</p>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-8">
                  <span className="text-[28px] font-semibold" style={{ color: 'var(--ink)' }}>
                    от {product.price.toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="text-[14px]" style={{ color: 'var(--muted)' }}>{product.priceUnit}</span>
                </div>

                {/* Colors */}
                {product.colors.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[13px] font-semibold tracking-[0.06em] uppercase" style={{ color: 'var(--muted)' }}>
                        Доступные цвета
                        <span className="ml-1.5 normal-case tracking-normal font-normal text-[12px]">
                          ({product.colors.length})
                        </span>
                      </p>
                      {product.colors.length > 10 && (
                        <button
                          onClick={() => setColorsExpanded((v) => !v)}
                          className="text-[12px] font-medium underline underline-offset-2"
                          style={{ color: 'var(--accent)' }}
                        >
                          {colorsExpanded ? 'Свернуть' : 'Все цвета'}
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(colorsExpanded ? product.colors : product.colors.slice(0, 10)).map((color) => (
                        <span
                          key={color.name}
                          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px]"
                          style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
                        >
                          <span
                            className="h-4 w-4 flex-shrink-0 rounded-full border border-white/50 shadow-sm"
                            style={{ background: color.hex }}
                            aria-hidden
                          />
                          {color.name}
                        </span>
                      ))}
                      {!colorsExpanded && product.colors.length > 10 && (
                        <button
                          onClick={() => setColorsExpanded(true)}
                          className="inline-flex items-center rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors hover:bg-[var(--sand)]"
                          style={{ borderColor: 'var(--line)', color: 'var(--accent)', borderStyle: 'dashed' }}
                        >
                          +{product.colors.length - 10} ещё
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Absorption / Diffusion */}
                <div className="mb-6 rounded-xl p-4" style={{ background: 'var(--sand)' }}>
                  <p className="text-[12px] tracking-[0.12em] uppercase mb-1" style={{ color: 'var(--muted)' }}>
                    {product.category === 'diffusers' ? 'Коэффициент рассеивания' : 'Коэффициент звукопоглощения'}
                    {product.freqRange && (
                      <span className="ml-1 normal-case tracking-normal">{product.freqRange}</span>
                    )}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--taupe)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${product.absorptionCoeff * 100}%`, background: 'var(--accent)' }}
                      />
                    </div>
                    <span className="text-[16px] font-semibold" style={{ color: 'var(--walnut)' }}>
                      αw {product.absorptionCoeff}
                    </span>
                  </div>
                </div>

                {/* Quantity + Add to request */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="flex items-center gap-2 rounded-full px-3 py-1.5"
                    style={{ border: '1px solid var(--line)' }}
                  >
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-black/8"
                      aria-label="Уменьшить количество"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-6 text-center text-[14px] font-semibold">{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-black/8"
                      aria-label="Увеличить количество"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="text-[13px]" style={{ color: 'var(--muted)' }}>{product.priceUnit}</span>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <button
                    onClick={handleAddToCart}
                    className="flex flex-1 items-center justify-center gap-2 rounded-[6px] py-3 text-[14px] font-semibold text-white transition-all"
                    style={{ background: added ? '#5a8a6a' : 'var(--accent)' }}
                    aria-label={added ? 'Добавлено в заявку' : 'Добавить в заявку'}
                  >
                    {added ? <Check size={16} /> : <FileText size={16} />}
                    {added ? 'Добавлено!' : 'В заявку'}
                  </button>
                  <button onClick={() => setContactOpen(true)} className="btn btn-out">
                    Получить расчёт
                  </button>
                  {session ? (
                    <button
                      onClick={toggleWishlist}
                      title={wishlisted ? 'Убрать из избранного' : 'В избранное'}
                      aria-pressed={wishlisted}
                      className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-[6px] border transition-colors"
                      style={{ borderColor: wishlisted ? 'var(--accent)' : 'var(--line)', background: wishlisted ? 'var(--sand)' : 'transparent' }}
                    >
                      <Heart size={18} fill={wishlisted ? 'var(--accent)' : 'none'} style={{ color: 'var(--accent)' }} />
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      title="Войдите, чтобы сохранить в избранное"
                      className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-[6px] border transition-colors hover:bg-[var(--sand)]"
                      style={{ borderColor: 'var(--line)' }}
                    >
                      <Heart size={18} fill="none" style={{ color: 'var(--muted)' }} />
                    </Link>
                  )}
                </div>

                {/* Specs preview */}
                <div className="border-t pt-6" style={{ borderColor: 'var(--line)' }}>
                  <p className="text-[13px] font-semibold mb-3 tracking-[0.06em] uppercase" style={{ color: 'var(--muted)' }}>
                    Характеристики
                  </p>
                  <div className="flex flex-col gap-2">
                    {product.specs.slice(0, 4).map((spec) => (
                      <div key={spec.label} className="flex justify-between text-[14px]" style={{ borderBottom: `1px solid var(--line)`, paddingBottom: '8px' }}>
                        <span style={{ color: 'var(--muted)' }}>{spec.label}</span>
                        <span className="font-medium text-right max-w-[60%]" style={{ color: 'var(--ink)' }}>{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealWrapper>
            </div>
          </div>
        </section>

        {/* Full description & specs */}
        <section className="pad border-t" style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}>
          <div className="wrap">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
              <RevealWrapper>
                <h2 className="text-[clamp(24px,3vw,36px)] font-semibold mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Об изделии
                </h2>
                <p className="text-[16px] leading-relaxed" style={{ color: 'var(--muted)' }}>{product.description}</p>

                {product.blogSlug && (
                  <Link
                    href={`/blog/${product.blogSlug}`}
                    className="mt-6 flex items-center gap-3 rounded-xl border px-5 py-4 transition-all duration-200 hover:border-[var(--taupe)] hover:shadow-card"
                    style={{ borderColor: 'var(--line)', background: 'var(--sand)' }}
                  >
                    <span className="text-[18px]" aria-hidden>📖</span>
                    <div>
                      <p className="text-[12px] tracking-[0.08em] uppercase mb-0.5" style={{ color: 'var(--muted)' }}>Статья в блоге</p>
                      <p className="text-[14px] font-medium" style={{ color: 'var(--ink)' }}>Читать о выборе и монтаже →</p>
                    </div>
                  </Link>
                )}

                <div className="mt-8">
                  <h3 className="text-[14px] font-semibold mb-3 tracking-[0.06em] uppercase" style={{ color: 'var(--muted)' }}>Материалы</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((m) => (
                      <span key={m} className="rounded-full border px-4 py-1.5 text-[13px]" style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}>{m}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-[14px] font-semibold mb-3 tracking-[0.06em] uppercase" style={{ color: 'var(--muted)' }}>Варианты отделки</h3>
                  <div className="flex flex-col gap-2">
                    {product.finishes.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <Check size={14} color="var(--accent)" aria-hidden />
                        <span className="text-[14px]" style={{ color: 'var(--ink)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealWrapper>

              <RevealWrapper delay={100}>
                <h2 className="text-[clamp(24px,3vw,36px)] font-semibold mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Размеры и параметры
                </h2>
                <div className="flex flex-col gap-0">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between py-3 text-[14px] border-b" style={{ borderColor: 'var(--line)' }}>
                      <span style={{ color: 'var(--muted)' }}>{spec.label}</span>
                      <span className="font-medium" style={{ color: 'var(--ink)' }}>{spec.value}</span>
                    </div>
                  ))}
                  {product.dimensions.map((dim) => (
                    <div key={dim.label} className="flex justify-between py-3 text-[14px] border-b" style={{ borderColor: 'var(--line)' }}>
                      <span style={{ color: 'var(--muted)' }}>{dim.label}</span>
                      <span className="font-medium" style={{ color: 'var(--ink)' }}>{dim.value}</span>
                    </div>
                  ))}
                </div>

                {/* CTA block */}
                <div className="mt-8 rounded-xl p-6" style={{ background: 'var(--sand)', border: '1px solid var(--line)' }}>
                  <p className="text-[14px] font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                    Нужен расчёт под ваш объект?
                  </p>
                  <p className="text-[13px] mb-4" style={{ color: 'var(--muted)' }}>
                    Рассчитаем количество, подберём параметры, согласуем сроки и стоимость индивидуально.
                  </p>
                  <button onClick={() => setContactOpen(true)} className="btn btn-dark w-full">
                    Получить расчёт
                  </button>
                </div>
              </RevealWrapper>
            </div>
          </div>
        </section>

        {/* Применение */}
        {matchedScenarios.length > 0 && (
          <section className="pad border-t" style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}>
            <div className="wrap">
              <RevealWrapper className="mb-10">
                <span className="eyebrow block mb-3">Применение</span>
                <h2
                  className="text-[clamp(24px,3vw,36px)] font-semibold"
                  style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
                >
                  Где пригодится
                </h2>
              </RevealWrapper>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {matchedScenarios.map((scenario, i) => (
                  <RevealWrapper key={scenario.slug} delay={i * 50}>
                    <Link
                      href={'/segments/' + scenario.slug}
                      className="group flex flex-col gap-3 rounded-xl border p-5 transition-all duration-200 hover:border-[var(--taupe)] hover:shadow-card"
                      style={{ borderColor: 'var(--line)', background: 'var(--cream)' }}
                    >
                      <h3 className="text-[16px] font-semibold leading-tight" style={{ color: 'var(--ink)' }}>
                        {scenario.label}
                      </h3>
                      <span className="text-[12px] font-medium" style={{ color: 'var(--accent)' }}>
                        Подробнее →
                      </span>
                    </Link>
                  </RevealWrapper>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="pad border-t" style={{ borderColor: 'var(--line)' }}>
            <div className="wrap">
              <RevealWrapper className="mb-10">
                <h2 className="text-[clamp(24px,3vw,36px)] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Похожие изделия
                </h2>
              </RevealWrapper>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r, i) => (
                  <RevealWrapper key={r.id} delay={i * 70}>
                    <Link
                      href={`/catalog/${r.category}/${r.slug}`}
                      className="group block overflow-hidden rounded-[8px] shadow-premium transition-transform duration-300 hover:-translate-y-2"
                      style={{ background: 'var(--cream-2)' }}
                    >
                      <div className="relative aspect-[16/11] overflow-hidden">
                        <Image src={r.thumbnail} alt={r.name} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.06]" sizes="33vw" />
                        <div className="absolute inset-0 -z-10 tex-walnut" />
                      </div>
                      <div className="p-5">
                        <h3 className="text-[22px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>{r.name}</h3>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[14px] font-semibold">от {r.price.toLocaleString('ru-RU')} ₽</span>
                          <span className="text-[13px] font-semibold flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                            Подробнее <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" aria-hidden />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </RevealWrapper>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="pad border-t" style={{ borderColor: 'var(--line)' }}>
          <div className="wrap">
            <RevealWrapper className="mb-10">
              <h2 className="text-[clamp(24px,3vw,36px)] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                Отзывы
              </h2>
            </RevealWrapper>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p style={{ color: 'var(--muted)' }} className="text-[14px]">Отзывов пока нет — будьте первым!</p>
                ) : reviews.map((r) => (
                  <div key={r.id} className="rounded-xl p-5" style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-[14px]" style={{ color: 'var(--ink)' }}>{r.name}</span>
                      <div className="flex gap-0.5" aria-label={`Оценка: ${r.rating} из 5`}>
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={12} fill={s <= r.rating ? 'var(--accent)' : 'none'} style={{ color: 'var(--accent)' }} aria-hidden />
                        ))}
                      </div>
                    </div>
                    <p className="text-[14px]" style={{ color: 'var(--muted)' }}>{r.text}</p>
                    <p className="text-[11px] mt-2" style={{ color: 'var(--taupe)' }}>
                      {new Date(r.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                {reviewSent ? (
                  <div className="rounded-xl p-6 text-center" style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                    <Check size={32} className="mx-auto mb-3" style={{ color: 'var(--accent)' }} aria-hidden />
                    <p className="font-semibold" style={{ color: 'var(--ink)' }}>Спасибо за отзыв!</p>
                    <p className="text-[13px] mt-1" style={{ color: 'var(--muted)' }}>Отзыв появится после модерации</p>
                  </div>
                ) : (
                  <form onSubmit={submitReview} className="rounded-xl p-6 space-y-4" style={{ background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                    <h3 className="text-[16px] font-semibold" style={{ color: 'var(--ink)' }}>Оставить отзыв</h3>
                    {reviewError && (
                      <p className="text-[13px] text-red-600 rounded-lg bg-red-50 px-3 py-2">{reviewError}</p>
                    )}
                    <div>
                      <label className="block text-[12px] mb-1" style={{ color: 'var(--muted)' }}>Ваше имя *</label>
                      <input
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 text-[14px] focus:outline-none"
                        style={{ borderColor: 'var(--line)', background: 'var(--cream)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] mb-1" style={{ color: 'var(--muted)' }}>Оценка</label>
                      <div className="flex gap-1" role="radiogroup" aria-label="Выберите оценку">
                        {[1,2,3,4,5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setReviewRating(s)}
                            aria-label={`${s} звезд`}
                            aria-pressed={reviewRating === s}
                          >
                            <Star size={22} fill={s <= reviewRating ? 'var(--accent)' : 'none'} style={{ color: 'var(--accent)' }} aria-hidden />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] mb-1" style={{ color: 'var(--muted)' }}>Текст отзыва *</label>
                      <textarea
                        required
                        minLength={10}
                        rows={4}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 text-[14px] focus:outline-none resize-none"
                        style={{ borderColor: 'var(--line)', background: 'var(--cream)' }}
                        placeholder="Расскажите о вашем опыте..."
                      />
                    </div>
                    <button type="submit" className="btn btn-dark w-full">Отправить отзыв</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <FloatingContact />

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} title="Получить расчёт" size="lg">
        <ContactForm onSuccess={() => setContactOpen(false)} />
      </Modal>
    </>
  )
}
