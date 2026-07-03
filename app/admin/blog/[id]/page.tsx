import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma, dbRetry } from '@/lib/prisma'
import { BlogForm } from '../BlogForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminBlogEditPage({ params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') redirect('/login')

  const { id } = await params

  const [post, categories, authors, tags] = await Promise.all([
    dbRetry(() =>
      prisma.blogPost.findUnique({
        where: { id },
        include: { tags: { select: { tagId: true } } },
      })
    ).catch(() => null),
    dbRetry(() =>
      prisma.blogCategory.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true } })
    ).catch(() => []),
    dbRetry(() =>
      prisma.blogAuthor.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })
    ).catch(() => []),
    dbRetry(() =>
      prisma.blogTag.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true, slug: true } })
    ).catch(() => []),
  ])

  if (!post) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/blog" className="text-[13px] hover:text-accent transition-colors" style={{ color: 'var(--muted)' }}>
          ← Все статьи
        </Link>
        <span style={{ color: 'var(--line)' }}>/</span>
        <h1 className="text-[22px] font-semibold line-clamp-1" style={{ fontFamily: 'var(--font-cormorant)' }}>
          {post.title}
        </h1>
        <Link
          href={`/blog/${post.slug}`}
          target="_blank"
          rel="noopener"
          className="ml-auto text-[12px] hover:text-accent"
          style={{ color: 'var(--muted)' }}
        >
          Открыть ↗
        </Link>
      </div>
      <BlogForm
        postId={post.id}
        categories={categories}
        authors={authors}
        tags={tags}
        initial={{
          slug: post.slug,
          title: post.title,
          description: post.description,
          content: post.content,
          excerpt: post.excerpt ?? '',
          contentType: post.contentType,
          categoryId: post.categoryId ?? '',
          authorId: post.authorId ?? '',
          tagIds: post.tags.map((t) => t.tagId),
          relatedSlugs: (post.relatedSlugs ?? []).join(', '),
          readTime: post.readTime != null ? String(post.readTime) : '',
          published: post.published,
          ogImage: post.ogImage ?? '',
        }}
      />
    </div>
  )
}
