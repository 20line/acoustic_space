import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma, dbRetry } from '@/lib/prisma'
import { BlogForm } from '../BlogForm'

export default async function AdminBlogNewPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') redirect('/login')

  const [categories, authors, tags] = await Promise.all([
    dbRetry(() => prisma.blogCategory.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true } })).catch(() => []),
    dbRetry(() => prisma.blogAuthor.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })).catch(() => []),
    dbRetry(() => prisma.blogTag.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true, slug: true } })).catch(() => []),
  ])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/blog" className="text-[13px] hover:text-accent transition-colors" style={{ color: 'var(--muted)' }}>
          ← Все статьи
        </Link>
        <span style={{ color: 'var(--line)' }}>/</span>
        <h1 className="text-[22px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
          Новая статья
        </h1>
      </div>
      <BlogForm categories={categories} authors={authors} tags={tags} />
    </div>
  )
}
