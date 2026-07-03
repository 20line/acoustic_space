import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma, dbRetry } from '@/lib/prisma'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL, SITE_NAME } from '@/lib/utils'

interface Props {
  searchParams: Promise<{ page?: string; q?: string }>
}

const POSTS_PER_PAGE = 12

const CONTENT_TYPE_LABEL: Record<string, string> = {
  ARTICLE: 'Статья',
  GUIDE: 'Руководство',
  CASE_STUDY: 'Кейс',
  COMPARISON: 'Сравнение',
  CHECKLIST: 'Чеклист',
  FAQ: 'FAQ',
  GLOSSARY: 'Глоссарий',
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page = '1', q = '' } = await searchParams
  const pageNum = Math.max(1, parseInt(page) || 1)

  if (q) {
    return buildMetadata({
      title: `«${q}» — поиск в блоге`,
      path: '/blog',
      noIndex: true,
    })
  }

  return buildMetadata({
    title: pageNum > 1 ? `Блог об акустике — страница ${pageNum}` : 'Блог об акустике помещений',
    description:
      'Статьи об акустике помещений, выборе панелей, проектировании студий и домашних кинотеатров. Экспертные материалы команды ACOUSTIC SPACE.',
    path: `/blog${pageNum > 1 ? `?page=${pageNum}` : ''}`,
  })
}

async function getPosts(page: number, query: string) {
  const where = {
    published: true,
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' as const } },
            { excerpt: { contains: query, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  try {
    const [posts, total] = await Promise.all([
      dbRetry(() =>
        prisma.blogPost.findMany({
          where,
          orderBy: { publishedAt: 'desc' },
          skip: (page - 1) * POSTS_PER_PAGE,
          take: POSTS_PER_PAGE,
          select: {
            slug: true,
            title: true,
            excerpt: true,
            readTime: true,
            contentType: true,
            publishedAt: true,
            category: { select: { slug: true, name: true } },
            author: { select: { name: true } },
            tags: { select: { tag: { select: { name: true } } }, take: 3 },
          },
        })
      ),
      dbRetry(() => prisma.blogPost.count({ where })),
    ])
    return { posts, total }
  } catch (err) {
    console.error('[blog] getPosts error:', err)
    return { posts: [], total: 0 }
  }
}

async function getCategories() {
  try {
    return await dbRetry(() =>
      prisma.blogCategory.findMany({
        orderBy: { sortOrder: 'asc' },
        select: {
          slug: true,
          name: true,
          _count: { select: { posts: { where: { published: true } } } },
        },
      })
    )
  } catch (err) {
    console.error('[blog] getCategories error:', err)
    return []
  }
}

function buildHref(page: number, q: string) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return `/blog${qs ? `?${qs}` : ''}`
}

function Pagination({ page, total, q }: { page: number; total: number; q: string }) {
  const totalPages = Math.ceil(total / POSTS_PER_PAGE)
  if (totalPages <= 1) return null

  const pages: (number | '…')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('…')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('…')
    pages.push(totalPages)
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-12" aria-label="Пагинация">
      {page > 1 && (
        <Link
          href={buildHref(page - 1, q)}
          className="px-3 py-2 text-[13px] rounded-lg border transition-colors hover:border-[var(--accent)] hover:text-accent"
          style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
          aria-label="Предыдущая страница"
        >
          ←
        </Link>
      )}
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-[13px]" style={{ color: 'var(--taupe)' }}>
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p, q)}
            className="min-w-[36px] px-3 py-2 text-center text-[13px] rounded-lg border transition-colors"
            style={{
              borderColor: p === page ? 'var(--accent)' : 'var(--line)',
              background: p === page ? 'var(--accent)' : 'transparent',
              color: p === page ? 'var(--cream)' : 'var(--ink)',
            }}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </Link>
        )
      )}
      {page < totalPages && (
        <Link
          href={buildHref(page + 1, q)}
          className="px-3 py-2 text-[13px] rounded-lg border transition-colors hover:border-[var(--accent)] hover:text-accent"
          style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
          aria-label="Следующая страница"
        >
          →
        </Link>
      )}
    </nav>
  )
}

export default async function BlogPage({ searchParams }: Props) {
  const { page = '1', q = '' } = await searchParams
  const pageNum = Math.max(1, parseInt(page) || 1)
  const query = q.trim().slice(0, 100)

  const [{ posts, total }, categories] = await Promise.all([
    getPosts(pageNum, query),
    getCategories(),
  ])
  const activeCats = categories.filter((c) => c._count.posts > 0)

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Блог об акустике',
    url: `${SITE_URL}/blog`,
    description: 'Статьи и руководства по акустике помещений, звукоизоляции и акустическому оформлению',
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
  }

  return (
    <>
      <ProgressBar />
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <main className="pt-24">
        {/* Breadcrumb */}
        <div className="wrap py-4">
          <nav className="flex gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>Блог</span>
          </nav>
        </div>

        <section className="pad pt-8 pb-16">
          <div className="wrap">
            {/* Hero */}
            <RevealWrapper className="max-w-[640px] mb-10">
              <span className="eyebrow block mb-4">Блог</span>
              <h1
                className="text-[clamp(32px,4.5vw,56px)] font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                Об акустике помещений
              </h1>
              <p className="mt-4 text-[16px]" style={{ color: 'var(--muted)' }}>
                Экспертные материалы о проектировании, расчёте и обработке помещений.
                Студии, кинотеатры, конференц-залы, рестораны.
              </p>
            </RevealWrapper>

            {/* Search */}
            <form
              action="/blog"
              method="get"
              className="mb-8 flex gap-2 max-w-md"
              role="search"
              aria-label="Поиск по блогу"
            >
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Поиск по статьям..."
                className="flex-1 border rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 transition-colors"
                style={{ borderColor: 'var(--line)' }}
                autoComplete="off"
                maxLength={100}
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--accent)' }}
              >
                Найти
              </button>
              {query && (
                <Link
                  href="/blog"
                  className="px-4 py-2.5 rounded-lg text-sm border transition-colors hover:text-accent"
                  style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
                >
                  ✕
                </Link>
              )}
            </form>

            {/* Category filter (hide during search) */}
            {!query && activeCats.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                <Link
                  href="/blog"
                  className="px-4 py-2 rounded-full text-[13px] font-medium transition-colors"
                  style={{ background: 'var(--accent)', color: 'var(--cream)' }}
                >
                  Все ({total})
                </Link>
                {activeCats.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/blog/category/${cat.slug}`}
                    className="px-4 py-2 rounded-full text-[13px] font-medium border transition-colors hover:border-[var(--accent)] hover:text-accent"
                    style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
                  >
                    {cat.name} ({cat._count.posts})
                  </Link>
                ))}
              </div>
            )}

            {/* Search result header */}
            {query && (
              <p className="mb-8 text-[15px]" style={{ color: 'var(--muted)' }}>
                {total > 0
                  ? `По запросу «${query}» найдено ${total} ${total === 1 ? 'статья' : total < 5 ? 'статьи' : 'статей'}`
                  : `По запросу «${query}» ничего не найдено`}
              </p>
            )}

            {/* Posts grid */}
            {posts.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-[18px] mb-3" style={{ color: 'var(--muted)' }}>
                  {query ? 'Попробуйте изменить запрос' : 'Статьи скоро появятся'}
                </p>
                {query && (
                  <Link href="/blog" className="text-[14px] underline hover:text-accent" style={{ color: 'var(--accent)' }}>
                    Все статьи
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post, i) => (
                    <RevealWrapper key={post.slug} delay={i * 60}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col rounded-xl border p-6 transition-all duration-300 hover:shadow-card hover:border-[var(--taupe)] h-full"
                        style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          {post.category && (
                            <span
                              className="rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.08em] uppercase"
                              style={{ background: 'var(--sand)', color: 'var(--accent)' }}
                            >
                              {post.category.name}
                            </span>
                          )}
                          <span
                            className="text-[11px] px-2 py-0.5 rounded"
                            style={{ background: 'var(--line)', color: 'var(--muted)' }}
                          >
                            {CONTENT_TYPE_LABEL[post.contentType] ?? post.contentType}
                          </span>
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
                          className="flex items-center justify-between mt-auto pt-4 border-t"
                          style={{ borderColor: 'var(--line)' }}
                        >
                          {post.publishedAt && (
                            <time className="text-[12px]" style={{ color: 'var(--muted)' }}>
                              {new Date(post.publishedAt).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
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

                <Pagination page={pageNum} total={total} q={query} />
              </>
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
