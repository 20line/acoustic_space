import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma, dbRetry } from '@/lib/prisma'
import { adminGuard } from '@/lib/admin-guard'

interface Context {
  params: Promise<{ id: string }>
}

// GET /api/admin/blog/[id]
export async function GET(_req: NextRequest, { params }: Context) {
  const session = await getServerSession(authOptions)
  const denied = adminGuard(session)
  if (denied) return denied

  const { id } = await params

  try {
    const post = await dbRetry(() =>
      prisma.blogPost.findUnique({
        where: { id },
        include: {
          category: { select: { id: true, name: true } },
          author: { select: { id: true, name: true } },
          tags: { select: { tagId: true, tag: { select: { id: true, name: true, slug: true } } } },
        },
      })
    )
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(post)
  } catch (err) {
    console.error('[GET /api/admin/blog/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const updateSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/).optional(),
  title: z.string().min(1).max(500).optional(),
  description: z.string().min(1).max(1000).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().max(500).nullable().optional(),
  contentType: z.enum(['ARTICLE', 'GUIDE', 'CASE_STUDY', 'COMPARISON', 'CHECKLIST', 'FAQ', 'GLOSSARY']).optional(),
  categoryId: z.string().nullable().optional(),
  authorId: z.string().nullable().optional(),
  tagIds: z.array(z.string()).optional(),
  relatedSlugs: z.array(z.string()).optional(),
  readTime: z.number().int().min(1).max(180).nullable().optional(),
  published: z.boolean().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  ogImage: z.string().max(500).nullable().optional(),
})

// PATCH /api/admin/blog/[id]
export async function PATCH(req: NextRequest, { params }: Context) {
  const session = await getServerSession(authOptions)
  const denied = adminGuard(session)
  if (denied) return denied

  const { id } = await params

  try {
    const body = await req.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { tagIds, ...rest } = parsed.data
    const post = await dbRetry(() =>
      prisma.blogPost.update({
        where: { id },
        data: {
          ...rest,
          publishedAt:
            rest.published === true && !rest.publishedAt
              ? new Date()
              : rest.publishedAt
                ? new Date(rest.publishedAt)
                : rest.publishedAt,
          ...(tagIds !== undefined
            ? {
                tags: {
                  deleteMany: {},
                  create: tagIds.map((tagId) => ({ tagId })),
                },
              }
            : {}),
        },
      })
    )

    return NextResponse.json(post)
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err) {
      const code = (err as { code: string }).code
      if (code === 'P2002') return NextResponse.json({ error: 'Slug уже занят' }, { status: 409 })
      if (code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[PATCH /api/admin/blog/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/blog/[id]
export async function DELETE(_req: NextRequest, { params }: Context) {
  const session = await getServerSession(authOptions)
  const denied = adminGuard(session)
  if (denied) return denied

  const { id } = await params

  try {
    await dbRetry(() => prisma.blogPost.delete({ where: { id } }))
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[DELETE /api/admin/blog/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
