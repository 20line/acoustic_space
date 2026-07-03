import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma, dbRetry } from '@/lib/prisma'
import { adminGuard } from '@/lib/admin-guard'

// GET /api/admin/blog — list all posts
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const denied = adminGuard(session)
  if (denied) return denied

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = 20

  try {
    const [posts, total] = await Promise.all([
      dbRetry(() =>
        prisma.blogPost.findMany({
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            slug: true,
            title: true,
            published: true,
            publishedAt: true,
            contentType: true,
            updatedAt: true,
            category: { select: { name: true } },
          },
        })
      ),
      dbRetry(() => prisma.blogPost.count()),
    ])
    return NextResponse.json({ posts, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    console.error('[GET /api/admin/blog]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const createSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Только a-z, 0-9 и дефис'),
  title: z.string().min(1).max(500),
  description: z.string().min(1).max(1000),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional().or(z.literal('')),
  contentType: z.enum(['ARTICLE', 'GUIDE', 'CASE_STUDY', 'COMPARISON', 'CHECKLIST', 'FAQ', 'GLOSSARY']).default('ARTICLE'),
  categoryId: z.string().optional().or(z.literal('')),
  authorId: z.string().optional().or(z.literal('')),
  tagIds: z.array(z.string()).optional(),
  relatedSlugs: z.array(z.string()).optional(),
  readTime: z.number().int().min(1).max(180).optional().nullable(),
  published: z.boolean().default(false),
  publishedAt: z.string().datetime().optional().or(z.literal('')),
  ogImage: z.string().max(500).optional().or(z.literal('')),
})

// POST /api/admin/blog — create post
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const denied = adminGuard(session)
  if (denied) return denied

  try {
    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { slug, title, description, content, excerpt, contentType, categoryId, authorId, tagIds, relatedSlugs, readTime, published, publishedAt, ogImage } = parsed.data

    const post = await dbRetry(() =>
      prisma.blogPost.create({
        data: {
          slug,
          title,
          description,
          content,
          excerpt: excerpt || null,
          contentType,
          categoryId: categoryId || null,
          authorId: authorId || null,
          relatedSlugs: relatedSlugs ?? [],
          readTime: readTime ?? null,
          published,
          publishedAt: published ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
          ogImage: ogImage || null,
          tags: tagIds?.length
            ? { create: tagIds.map((tagId) => ({ tagId })) }
            : undefined,
        },
      })
    )

    return NextResponse.json(post, { status: 201 })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Slug уже занят' }, { status: 409 })
    }
    console.error('[POST /api/admin/blog]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
