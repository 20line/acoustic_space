import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma, dbRetry } from '@/lib/prisma'
import { BlogAdminActions } from './BlogAdminActions'

interface Props {
  searchParams: Promise<{ page?: string }>
}

const LIMIT = 20

export default async function AdminBlogPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') redirect('/login')

  const { page = '1' } = await searchParams
  const pageNum = Math.max(1, parseInt(page) || 1)

  const [posts, total] = await Promise.all([
    dbRetry(() =>
      prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * LIMIT,
        take: LIMIT,
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
    ).catch(() => []),
    dbRetry(() => prisma.blogPost.count()).catch(() => 0),
  ])

  const totalPages = Math.ceil(total / LIMIT)

  const CONTENT_TYPE: Record<string, string> = {
    ARTICLE: 'Статья', GUIDE: 'Руководство', CASE_STUDY: 'Кейс',
    COMPARISON: 'Сравнение', CHECKLIST: 'Чеклист', FAQ: 'FAQ', GLOSSARY: 'Глоссарий',
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Статьи блога
          </h1>
          <p className="text-[13px] mt-1" style={{ color: 'var(--muted)' }}>Всего: {total}</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-lg px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          + Новая статья
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border p-12 text-center" style={{ borderColor: 'var(--line)', background: 'white' }}>
          <p style={{ color: 'var(--muted)' }}>Статей пока нет.</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--line)', background: 'white' }}>
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', background: '#FAFAF9' }}>
                <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--muted)' }}>Заголовок</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell" style={{ color: 'var(--muted)' }}>Тип</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell" style={{ color: 'var(--muted)' }}>Категория</th>
                <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--muted)' }}>Статус</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell" style={{ color: 'var(--muted)' }}>Изменён</th>
                <th className="px-4 py-3 text-right font-medium" style={{ color: 'var(--muted)' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr
                  key={post.id}
                  style={{ borderBottom: i < posts.length - 1 ? '1px solid var(--line)' : undefined }}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium line-clamp-1" style={{ color: 'var(--ink)' }}>{post.title}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--taupe)' }}>/blog/{post.slug}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell" style={{ color: 'var(--muted)' }}>
                    {CONTENT_TYPE[post.contentType] ?? post.contentType}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell" style={{ color: 'var(--muted)' }}>
                    {post.category?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                      style={{
                        background: post.published ? '#DCFCE7' : '#FEF9C3',
                        color: post.published ? '#166534' : '#854D0E',
                      }}
                    >
                      {post.published ? 'Опубликована' : 'Черновик'}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[12px]" style={{ color: 'var(--muted)' }}>
                    {new Date(post.updatedAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener"
                        className="text-[12px] hover:text-accent transition-colors"
                        style={{ color: 'var(--muted)' }}
                        title="Открыть на сайте"
                      >
                        ↗
                      </Link>
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="rounded-md px-3 py-1 text-[12px] border transition-colors hover:border-[var(--accent)] hover:text-accent"
                        style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
                      >
                        Изменить
                      </Link>
                      <BlogAdminActions id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {pageNum > 1 && (
            <Link href={`/admin/blog?page=${pageNum - 1}`} className="rounded-lg border px-3 py-2 text-[13px] hover:text-accent" style={{ borderColor: 'var(--line)' }}>←</Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/blog?page=${p}`}
              className="rounded-lg border min-w-[36px] px-3 py-2 text-[13px] text-center"
              style={{
                borderColor: p === pageNum ? 'var(--accent)' : 'var(--line)',
                background: p === pageNum ? 'var(--accent)' : 'transparent',
                color: p === pageNum ? 'white' : 'var(--ink)',
              }}
            >
              {p}
            </Link>
          ))}
          {pageNum < totalPages && (
            <Link href={`/admin/blog?page=${pageNum + 1}`} className="rounded-lg border px-3 py-2 text-[13px] hover:text-accent" style={{ borderColor: 'var(--line)' }}>→</Link>
          )}
        </div>
      )}
    </div>
  )
}
