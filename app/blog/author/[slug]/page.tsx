import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma, dbRetry } from '@/lib/prisma'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { buildMetadata } from '@/lib/metadata'

interface Props {
  params: Promise<{ slug: string }>
}

async function getAuthor(slug: string) {
  try {
    return await dbRetry(() => prisma.blogAuthor.findUnique({ where: { slug } }))
  } catch {
    return null
  }
}

async function getAuthorPosts(authorId: string) {
  try {
    return await dbRetry(() =>
      prisma.blogPost.findMany({
        where: { authorId, published: true },
        orderBy: { publishedAt: 'desc' },
        select: {
          slug: true,
          title: true,
          excerpt: true,
          readTime: true,
          contentType: true,
          publishedAt: true,
          category: { select: { slug: true, name: true } },
        },
      })
    )
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  try {
    const authors = await dbRetry(() =>
      prisma.blogAuthor.findMany({ select: { slug: true } })
    )
    return authors.map((a) => ({ slug: a.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthor(slug)
  if (!author) return buildMetadata({ title: 'Автор не найден', noIndex: true })
  return buildMetadata({
    title: `${author.name} — автор блога ACOUSTIC SPACE`,
    description: author.bio ?? `Статьи автора ${author.name} об акустике помещений, панелях и проектировании.`,
    path: `/blog/author/${slug}`,
    image: author.avatar ?? undefined,
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

export default async function BlogAuthorPage({ params }: Props) {
  const { slug } = await params
  const author = await getAuthor(slug)
  if (!author) notFound()

  const posts = await getAuthorPosts(author.id)

  const authorSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.role ?? undefined,
    description: author.bio ?? undefined,
    image: author.avatar ?? undefined,
    url: `/blog/author/${author.slug}`,
  }

  return (
    <>
      <ProgressBar />
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />
      <main className="pt-24">
        {/* Breadcrumb */}
        <div className="wrap py-4">
          <nav className="flex flex-wrap gap-2 text-[13px]" style={{ color: 'var(--muted)' }} aria-label="Хлебные крошки">
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span aria-hidden>/</span>
            <Link href="/blog" className="hover:text-accent">Блог</Link>
            <span aria-hidden>/</span>
            <span style={{ color: 'var(--ink)' }}>{author.name}</span>
          </nav>
        </div>

        {/* Author hero */}
        <section className="pad pt-8 pb-12">
          <div className="wrap">
            <RevealWrapper className="flex items-start gap-6 mb-12 max-w-2xl">
              {author.avatar && (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={80}
                  height={80}
                  className="rounded-full shrink-0 object-cover"
                />
              )}
              <div>
                <span className="eyebrow block mb-2">Автор</span>
                <h1
                  className="text-[clamp(28px,4vw,48px)] font-semibold leading-tight"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {author.name}
                </h1>
                {author.role && (
                  <p className="mt-1 text-[14px] font-medium" style={{ color: 'var(--accent)' }}>
                    {author.role}
                  </p>
                )}
                {author.bio && (
                  <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {author.bio}
                  </p>
                )}
                <p className="mt-3 text-[13px]" style={{ color: 'var(--taupe)' }}>
                  {posts.length} {posts.length === 1 ? 'статья' : posts.length < 5 ? 'статьи' : 'статей'}
                </p>
              </div>
            </RevealWrapper>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 mb-8 text-[13px] hover:text-accent transition-colors"
              style={{ color: 'var(--muted)' }}
            >
              ← Все статьи
            </Link>

            {posts.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>У этого автора пока нет опубликованных статей.</p>
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
