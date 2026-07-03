import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma, dbRetry } from '@/lib/prisma'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

async function getCategory(slug: string) {
  try {
    return await dbRetry(() => prisma.blogCategory.findUnique({ where: { slug } }))
  } catch {
    return null
  }
}

async function getCategoryPosts(categoryId: string) {
  try {
    return await dbRetry(() => prisma.blogPost.findMany({
      where: { categoryId, published: true },
      orderBy: { publishedAt: 'desc' },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        readTime: true,
        contentType: true,
        publishedAt: true,
        tags: { select: { tag: { select: { name: true } } }, take: 3 },
      },
    }))
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  try {
    const cats = await dbRetry(() =>
      prisma.blogCategory.findMany({ select: { slug: true } })
    )
    return cats.map((c) => ({ slug: c.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = await getCategory(slug)
  if (!cat) return buildMetadata({ title: 'Категория не найдена', noIndex: true })
  return buildMetadata({
    title: cat.name,
    description: cat.description ?? `Статьи по теме «${cat.name}» — акустика, панели, проектирование.`,
    path: `/blog/category/${slug}`,
  })
}

const CONTENT_TYPE_LABEL: Record<string, string> = {
  ARTICLE: 'Статья', GUIDE: 'Руководство', CASE_STUDY: 'Кейс',
  COMPARISON: 'Сравнение', CHECKLIST: 'Чеклист', FAQ: 'FAQ', GLOSSARY: 'Глоссарий',
}

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params
  const cat = await getCategory(slug)
  if (!cat) notFound()

  const posts = await getCategoryPosts(cat.id)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Блог', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: cat.name, item: `${SITE_URL}/blog/category/${slug}` },
    ],
  }

  return (
    <>
      <ProgressBar />
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="pt-24">
        <div className="wrap py-4">
          <nav className="flex flex-wrap gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-accent">Блог</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>{cat.name}</span>
          </nav>
        </div>

        <section className="pad pt-8 pb-16">
          <div className="wrap">
            <RevealWrapper className="max-w-[560px] mb-12">
              <span className="eyebrow block mb-4">Категория</span>
              <h1 className="text-[clamp(32px,4.5vw,56px)] font-semibold leading-tight" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {cat.name}
              </h1>
              {cat.description && (
                <p className="mt-4 text-[16px]" style={{ color: 'var(--muted)' }}>{cat.description}</p>
              )}
            </RevealWrapper>

            <Link href="/blog" className="inline-flex items-center gap-2 mb-8 text-[13px] hover:text-accent transition-colors" style={{ color: 'var(--muted)' }}>
              ← Все статьи
            </Link>

            {posts.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>В этой категории пока нет статей.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <RevealWrapper key={post.slug} delay={i * 60}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col rounded-xl border p-6 transition-all duration-300 hover:shadow-card hover:border-[var(--taupe)] h-full"
                      style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[11px] px-2 py-0.5 rounded" style={{ background: 'var(--line)', color: 'var(--muted)' }}>
                          {CONTENT_TYPE_LABEL[post.contentType] ?? post.contentType}
                        </span>
                        {post.readTime && (
                          <span className="text-[12px] ml-auto" style={{ color: 'var(--muted)' }}>{post.readTime} мин</span>
                        )}
                      </div>

                      <h2 className="text-[22px] font-semibold mb-3 leading-tight group-hover:text-accent transition-colors flex-1" style={{ fontFamily: 'var(--font-cormorant)' }}>
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="text-[14px] mb-4 line-clamp-3" style={{ color: 'var(--muted)' }}>{post.excerpt}</p>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
                        {post.publishedAt && (
                          <time className="text-[12px]" style={{ color: 'var(--muted)' }}>
                            {new Date(post.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                          </time>
                        )}
                        <span className="text-[13px] font-medium" style={{ color: 'var(--accent)' }}>Читать →</span>
                      </div>
                    </Link>
                  </RevealWrapper>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <FloatingContact />
    </>
  )
}
