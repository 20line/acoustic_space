import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/data/products'
import { prisma, dbRetry } from '@/lib/prisma'

// GET /api/search?q=текст
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim().toLowerCase() ?? ''
  if (q.length < 2) return NextResponse.json([])

  const productResults = products
    .filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    )
    .slice(0, 8)
    .map((p) => ({
      type: 'product' as const,
      id: p.id,
      slug: p.slug,
      category: p.category,
      name: p.name,
      tagline: p.tagline,
      thumbnail: p.thumbnail,
      price: p.price,
      priceUnit: p.priceUnit,
      href: `/catalog/${p.category}/${p.slug}`,
    }))

  let blogResults: {
    type: 'blog'
    id: string
    slug: string
    name: string
    tagline: string
    href: string
  }[] = []

  try {
    const posts = await dbRetry(() =>
      prisma.blogPost.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { excerpt: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, slug: true, title: true, excerpt: true },
        take: 4,
        orderBy: { publishedAt: 'desc' },
      })
    )
    blogResults = posts.map((p) => ({
      type: 'blog' as const,
      id: p.id,
      slug: p.slug,
      name: p.title,
      tagline: p.excerpt ?? '',
      href: `/blog/${p.slug}`,
    }))
  } catch {
    // DB unavailable — return only product results
  }

  return NextResponse.json([...productResults, ...blogResults])
}
