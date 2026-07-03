import { NextResponse } from 'next/server'
import { prisma, dbRetry } from '@/lib/prisma'
import { SITE_URL, SITE_NAME } from '@/lib/utils'

export const revalidate = 3600

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function GET() {
  let posts: Array<{
    slug: string
    title: string
    excerpt: string | null
    publishedAt: Date | null
    updatedAt: Date
    category: { name: string; slug: string } | null
    author: { name: string } | null
  }> = []

  try {
    posts = await dbRetry(() =>
      prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { publishedAt: 'desc' },
        take: 50,
        select: {
          slug: true,
          title: true,
          excerpt: true,
          publishedAt: true,
          updatedAt: true,
          category: { select: { name: true, slug: true } },
          author: { select: { name: true } },
        },
      })
    )
  } catch {
    // Return minimal valid RSS on DB error
  }

  const now = new Date().toUTCString()
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`
      const pubDate = (p.publishedAt ?? p.updatedAt).toUTCString()
      const description = p.excerpt ? esc(p.excerpt) : ''
      return `
    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      ${p.category ? `<category>${esc(p.category.name)}</category>` : ''}
      ${p.author ? `<author>${esc(p.author.name)}</author>` : ''}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_NAME)} — Блог об акустике помещений</title>
    <link>${SITE_URL}/blog</link>
    <description>Статьи об акустике помещений, выборе панелей, проектировании студий и домашних кинотеатров. Экспертные материалы команды ${esc(SITE_NAME)}.</description>
    <language>ru</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/images/og/default.jpg</url>
      <title>${esc(SITE_NAME)}</title>
      <link>${SITE_URL}/blog</link>
    </image>
${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
