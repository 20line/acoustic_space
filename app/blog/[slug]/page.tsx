import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { marked } from 'marked'
import { prisma, dbRetry } from '@/lib/prisma'
import { SITE_URL } from '@/lib/utils'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { CtaBandSection } from '@/components/sections/CtaBandSection'
import { buildMetadata } from '@/lib/metadata'
import { sanitizeHtml } from '@/lib/sanitize'
import { ShareButtons } from '@/components/blog/ShareButtons'

interface Props {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  try {
    return await dbRetry(() => prisma.blogPost.findUnique({
      where: { slug, published: true },
      include: {
        category: { select: { slug: true, name: true } },
        author: true,
        tags: { include: { tag: true } },
        faqItems: { orderBy: { order: 'asc' } },
        howToSteps: { orderBy: { order: 'asc' } },
      },
    }))
  } catch {
    return null
  }
}

async function getRelated(slugs: string[]) {
  if (!slugs.length) return []
  try {
    return await dbRetry(() => prisma.blogPost.findMany({
      where: { slug: { in: slugs }, published: true },
      select: { slug: true, title: true, excerpt: true, readTime: true, category: { select: { name: true } } },
      take: 3,
    }))
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  try {
    const posts = await dbRetry(() =>
      prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true },
      })
    )
    return posts.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return buildMetadata({ title: 'Статья не найдена', noIndex: true, path: `/blog/${slug}` })
  return buildMetadata({
    title: post.title,
    description: post.description,
    image: post.ogImage ?? undefined,
    path: `/blog/${slug}`,
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const related = await getRelated(post.relatedSlugs)
  const htmlContent = sanitizeHtml(await marked(post.content, { gfm: true, breaks: true }))

  // Schema.org Article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: post.author ? {
      '@type': 'Person',
      name: post.author.name,
      url: `${SITE_URL}/blog/author/${post.author.slug}`,
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'ACOUSTIC SPACE',
      url: SITE_URL,
    },
    image: post.ogImage ? `${SITE_URL}${post.ogImage}` : undefined,
    keywords: post.tags.map(t => t.tag.name).join(', '),
    inLanguage: 'ru',
  }

  // Schema.org FAQPage
  const faqSchema = post.faqItems.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqItems.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null

  // Schema.org BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Блог', item: `${SITE_URL}/blog` },
      ...(post.category ? [{ '@type': 'ListItem', position: 3, name: post.category.name, item: `${SITE_URL}/blog/category/${post.category.slug}` }] : []),
      { '@type': 'ListItem', position: post.category ? 4 : 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  }

  return (
    <>
      <ProgressBar />
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="pt-24">
        {/* Breadcrumb */}
        <div className="wrap py-4">
          <nav className="flex flex-wrap gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-accent">Блог</Link>
            {post.category && (
              <>
                <span>/</span>
                <Link href={`/blog/category/${post.category.slug}`} className="hover:text-accent">{post.category.name}</Link>
              </>
            )}
            <span>/</span>
            <span style={{ color: 'var(--ink)' }} className="truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>

        <article className="pad pt-8 pb-16">
          <div className="wrap max-w-3xl">
            {/* Category + tags */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {post.category && (
                <Link
                  href={`/blog/category/${post.category.slug}`}
                  className="rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.08em] uppercase hover:opacity-80 transition-opacity"
                  style={{ background: 'var(--sand)', color: 'var(--accent)' }}
                >
                  {post.category.name}
                </Link>
              )}
              {post.tags.map(t => (
                <Link key={t.tag.slug} href={`/blog/tag/${t.tag.slug}`} className="text-[12px] px-2 py-0.5 rounded border hover:border-[var(--accent)] hover:text-accent transition-colors" style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}>
                  #{t.tag.name}
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-[clamp(28px,4.5vw,52px)] font-semibold leading-tight mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-10 pb-6 border-b" style={{ borderColor: 'var(--line)' }}>
              {post.author && (
                <Link href={`/blog/author/${post.author.slug}`} className="text-[14px] hover:text-accent transition-colors" style={{ color: 'var(--muted)' }}>
                  {post.author.name}
                </Link>
              )}
              {post.publishedAt && (
                <time className="text-[14px]" style={{ color: 'var(--muted)' }}>
                  {new Date(post.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </time>
              )}
              {post.readTime && (
                <span className="text-[14px]" style={{ color: 'var(--muted)' }}>
                  {post.readTime} мин чтения
                </span>
              )}
            </div>

            {/* Article content */}
            <div
              className="prose prose-lg max-w-none"
              style={{
                '--tw-prose-body': 'var(--ink)',
                '--tw-prose-headings': 'var(--ink)',
                '--tw-prose-links': 'var(--accent)',
                '--tw-prose-code': 'var(--ink)',
                '--tw-prose-pre-bg': 'var(--cream-2)',
                '--tw-prose-td-borders': 'var(--line)',
                '--tw-prose-th-borders': 'var(--line)',
              } as React.CSSProperties}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* FAQ block */}
            {post.faqItems.length > 0 && (
              <section className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--line)' }}>
                <h2 className="text-[28px] font-semibold mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Часто задаваемые вопросы
                </h2>
                <div className="space-y-4">
                  {post.faqItems.map(faq => (
                    <details key={faq.id} className="group rounded-xl border p-5 cursor-pointer" style={{ borderColor: 'var(--line)', background: 'var(--cream-2)' }}>
                      <summary className="flex items-center justify-between font-semibold text-[16px] list-none select-none">
                        {faq.question}
                        <span className="ml-4 shrink-0 transition-transform group-open:rotate-180" style={{ color: 'var(--accent)' }}>↓</span>
                      </summary>
                      <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--muted)' }}>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Tags footer */}
            {post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t flex flex-wrap gap-2" style={{ borderColor: 'var(--line)' }}>
                {post.tags.map(t => (
                  <Link key={t.tag.slug} href={`/blog/tag/${t.tag.slug}`} className="text-[13px] px-3 py-1 rounded-full border hover:border-[var(--accent)] hover:text-accent transition-colors" style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}>
                    #{t.tag.name}
                  </Link>
                ))}
              </div>
            )}

            <ShareButtons
              url={`${SITE_URL}/blog/${post.slug}`}
              title={post.title}
            />
          </div>
        </article>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="pad py-12 border-t" style={{ borderColor: 'var(--line)' }}>
            <div className="wrap">
              <h2 className="text-[28px] font-semibold mb-8" style={{ fontFamily: 'var(--font-cormorant)' }}>
                По теме
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {related.map(r => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group block rounded-xl border p-5 transition-all hover:border-[var(--taupe)] hover:shadow-card"
                    style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}
                  >
                    {r.category && (
                      <span className="text-[11px] font-semibold tracking-[0.08em] uppercase" style={{ color: 'var(--accent)' }}>
                        {r.category.name}
                      </span>
                    )}
                    <h3 className="mt-2 text-[18px] font-semibold leading-tight group-hover:text-accent transition-colors" style={{ fontFamily: 'var(--font-cormorant)' }}>
                      {r.title}
                    </h3>
                    {r.excerpt && (
                      <p className="mt-2 text-[13px] line-clamp-2" style={{ color: 'var(--muted)' }}>{r.excerpt}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <CtaBandSection />
      </main>
      <Footer />
      <BackToTop />
      <FloatingContact />
    </>
  )
}
