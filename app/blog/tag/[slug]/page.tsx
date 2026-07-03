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

async function getTag(slug: string) {
  try {
    return await dbRetry(() => prisma.blogTag.findUnique({ where: { slug } }))
  } catch {
    return null
  }
}

async function getTagPosts(tagId: string) {
  try {
    return await dbRetry(() =>
      prisma.blogPost.findMany({
        where: {
          published: true,
          tags: { some: { tagId } },
        },
        orderBy: { publishedAt: 'desc' },
        select: {
          slug: true,
          title: true,
          excerpt: true,
          readTime: true,
          contentType: true,
          publishedAt: true,
          category: { select: { slug: true, name: true } },
          tags: { select: { tag: { select: { name: true } } }, take: 3 },
        },
      })
    )
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  try {
    const tags = await dbRetry(() =>
      prisma.blogTag.findMany({ select: { slug: true } })
    )
    return tags.map((t) => ({ slug: t.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tag = await getTag(slug)
  if (!tag) return buildMetadata({ title: 'Тег не найден', noIndex: true })
  return buildMetadata({
    title: `#${tag.name} — статьи об акустике`,
    description: `Все материалы по теме «${tag.name}»: советы, руководства и кейсы от команды ACOUSTIC SPACE.`,
    path: `/blog/tag/${slug}`,
  })
}

const CONTENT_TYPE_LABEL: Record<string, string> = {
  ARTICLE: 'Статья',
  GUIDE: 'Руководство',
  CASE_STUDY: 'Кейс',
  COMPARISON: 'Сравнение',
  CHECKLIST: 'Чеклист',
  FAQ: 'FAQ',
  GLOSSARY: 'Глоссарий',
}

export default async function BlogTagPage({ params }: Props) {
  const { slug } = await params
  const tag = await getTag(slug)
  if (!tag) notFound()

  const posts = await getTagPosts(tag.id)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Блог', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: `#${tag.name}`, item: `${SITE_URL}/blog/tag/${slug}` },
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
          <nav className="flex flex-wrap gap-2 text-[13px]" style={{ color: 'var(--muted)' }} aria-label="Хлебные крошки">
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span aria-hidden>/</span>
            <Link href="/blog" className="hover:text-accent">Блог</Link>
            <span aria-hidden>/</span>
            <span style={{ color: 'var(--ink)' }}>#{tag.name}</span>
          </nav>
        </div>

        <section className="pad pt-8 pb-16">
          <div className="wrap">
            <RevealWrapper className="max-w-[560px] mb-12">
              <span className="eyebrow block mb-4">Тег</span>
              <h1
                className="text-[clamp(32px,4.5vw,56px)] font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                #{tag.name}
              </h1>
              <p className="mt-4 text-[16px]" style={{ color: 'var(--muted)' }}>
                {posts.length} {posts.length === 1 ? 'материал' : posts.length < 5 ? 'материала' : 'материалов'} по этой теме
              </p>
            </RevealWrapper>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 mb-8 text-[13px] hover:text-accent transition-colors"
              style={{ color: 'var(--muted)' }}
            >
              ← Все статьи
            </Link>

            {posts.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>По этому тегу пока нет статей.</p>
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
                        <span
                          className="text-[11px] px-2 py-0.5 rounded"
                          style={{ background: 'var(--line)', color: 'var(--muted)' }}
                        >
                          {CONTENT_TYPE_LABEL[post.contentType] ?? post.contentType}
                        </span>
                        {post.category && (
                          <span className="text-[11px]" style={{ color: 'var(--muted)' }}>
                            {post.category.name}
                          </span>
                        )}
                        {post.readTime && (
                          <span className="text-[12px] ml-auto" style={{ color: 'var(--muted)' }}>
                            {post.readTime} мин
                          </span>
                        )}
                      </div>

                      <h2
                        className="text-[22px] font-semibold mb-3 leading-tight group-hover:text-accent transition-colors flex-1"
                        style={{ fontFamily: 'var(--font-cormorant)' }}
                      >
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="text-[14px] mb-4 line-clamp-3" style={{ color: 'var(--muted)' }}>
                          {post.excerpt}
                        </p>
                      )}

                      <div
                        className="flex flex-wrap items-center justify-between mt-auto pt-4 border-t gap-2"
                        style={{ borderColor: 'var(--line)' }}
                      >
                        {post.publishedAt && (
                          <time className="text-[12px]" style={{ color: 'var(--muted)' }}>
                            {new Date(post.publishedAt).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                            })}
                          </time>
                        )}
                        <span className="text-[13px] font-medium" style={{ color: 'var(--accent)' }}>
                          Читать →
                        </span>
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
