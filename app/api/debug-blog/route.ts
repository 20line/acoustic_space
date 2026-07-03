import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const result: Record<string, unknown> = {
    env: {
      hasDIRECT_URL: !!process.env.DIRECT_URL,
      hasDATABASE_URL: !!process.env.DATABASE_URL,
      DIRECT_URL_host: process.env.DIRECT_URL
        ? new URL(process.env.DIRECT_URL.replace('postgresql://', 'https://')).hostname
        : null,
      DATABASE_URL_host: process.env.DATABASE_URL
        ? new URL(process.env.DATABASE_URL.replace('postgresql://', 'https://')).hostname
        : null,
    },
  }

  try {
    const count = await prisma.blogPost.count()
    result.blogPost_count = count
  } catch (e) {
    result.blogPost_count_error = e instanceof Error ? e.message : String(e)
  }

  try {
    const published = await prisma.blogPost.count({ where: { published: true } })
    result.blogPost_published = published
  } catch (e) {
    result.blogPost_published_error = e instanceof Error ? e.message : String(e)
  }

  try {
    const cats = await prisma.blogCategory.count()
    result.blogCategory_count = cats
  } catch (e) {
    result.blogCategory_count_error = e instanceof Error ? e.message : String(e)
  }

  try {
    const first = await prisma.blogPost.findFirst({
      where: { published: true },
      select: { slug: true, title: true },
    })
    result.first_post = first
  } catch (e) {
    result.first_post_error = e instanceof Error ? e.message : String(e)
  }

  // Exact query used by the /blog page
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
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
    result.findMany_posts = posts.length
    result.findMany_first = posts[0] ?? null
  } catch (e) {
    result.findMany_error = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json(result, { status: 200 })
}
