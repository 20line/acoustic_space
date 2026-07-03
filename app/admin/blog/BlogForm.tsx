'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface BlogFormData {
  slug: string
  title: string
  description: string
  content: string
  excerpt: string
  contentType: string
  categoryId: string
  authorId: string
  tagIds: string[]
  relatedSlugs: string
  readTime: string
  published: boolean
  ogImage: string
}

interface Category { id: string; name: string }
interface Author { id: string; name: string }
interface Tag { id: string; name: string; slug: string }

interface Props {
  initial?: Partial<BlogFormData>
  postId?: string
  categories: Category[]
  authors: Author[]
  tags: Tag[]
}

const CONTENT_TYPES = [
  ['ARTICLE', 'Статья'],
  ['GUIDE', 'Руководство'],
  ['CASE_STUDY', 'Кейс'],
  ['COMPARISON', 'Сравнение'],
  ['CHECKLIST', 'Чеклист'],
  ['FAQ', 'FAQ'],
  ['GLOSSARY', 'Глоссарий'],
] as const

const inputCls = 'w-full border rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 transition-colors'
const inputStyle = { borderColor: 'var(--line)' }

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[а-яёa-z0-9]+/gi, (m) => m)
    .replace(/[^a-z0-9Ѐ-ӿ]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/[а-яё]/g, (c) => {
      const map: Record<string, string> = {
        а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i',
        й: 'j', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
        у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '',
        э: 'e', ю: 'yu', я: 'ya',
      }
      return map[c] ?? c
    })
}

export function BlogForm({ initial = {}, postId, categories, authors, tags }: Props) {
  const router = useRouter()
  const isEdit = !!postId

  const [form, setForm] = useState<BlogFormData>({
    slug: initial.slug ?? '',
    title: initial.title ?? '',
    description: initial.description ?? '',
    content: initial.content ?? '',
    excerpt: initial.excerpt ?? '',
    contentType: initial.contentType ?? 'ARTICLE',
    categoryId: initial.categoryId ?? '',
    authorId: initial.authorId ?? '',
    tagIds: initial.tagIds ?? [],
    relatedSlugs: initial.relatedSlugs ?? '',
    readTime: initial.readTime ?? '',
    published: initial.published ?? false,
    ogImage: initial.ogImage ?? '',
  })
  const [slugManual, setSlugManual] = useState(!!initial.slug)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const set = useCallback(<K extends keyof BlogFormData>(field: K, value: BlogFormData[K]) => {
    setForm((f) => ({ ...f, [field]: value }))
    setSaved(false)
  }, [])

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    set('title', val)
    if (!slugManual) {
      set('slug', slugify(val))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const body = {
      slug: form.slug,
      title: form.title,
      description: form.description,
      content: form.content,
      excerpt: form.excerpt || null,
      contentType: form.contentType,
      categoryId: form.categoryId || null,
      authorId: form.authorId || null,
      tagIds: form.tagIds,
      relatedSlugs: form.relatedSlugs
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      readTime: form.readTime ? parseInt(form.readTime) : null,
      published: form.published,
      ogImage: form.ogImage || null,
    }

    try {
      const url = isEdit ? `/api/admin/blog/${postId}` : '/api/admin/blog'
      const method = isEdit ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Ошибка сохранения')
      }

      const result = await res.json()
      setSaved(true)

      if (!isEdit) {
        router.push(`/admin/blog/${result.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg px-4 py-3 text-[13px]" style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' }}>
          {error}
        </div>
      )}

      {saved && (
        <div className="rounded-lg px-4 py-3 text-[13px]" style={{ background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>
          Сохранено ✓
        </div>
      )}

      {/* Title + Slug */}
      <div className="rounded-xl border p-6 space-y-4" style={{ background: 'white', borderColor: 'var(--line)' }}>
        <h2 className="text-[15px] font-medium" style={{ color: 'var(--ink)' }}>Основное</h2>
        <div>
          <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Заголовок *</label>
          <input required value={form.title} onChange={handleTitleChange} className={inputCls} style={inputStyle} placeholder="Как выбрать акустические панели..." />
        </div>
        <div>
          <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
            Slug (URL) *
            <span className="ml-2 font-normal" style={{ color: 'var(--taupe)' }}>/blog/{form.slug || '...'}</span>
          </label>
          <input
            required
            value={form.slug}
            onChange={(e) => { set('slug', e.target.value); setSlugManual(true) }}
            className={inputCls}
            style={inputStyle}
            pattern="[a-z0-9-]+"
            placeholder="kak-vybrat-paneli"
          />
        </div>
        <div>
          <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--muted)' }}>SEO-описание * (до 160 символов)</label>
          <textarea
            required
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={2}
            maxLength={1000}
            className={inputCls + ' resize-none'}
            style={inputStyle}
            placeholder="Краткое описание для поисковиков..."
          />
          <span className="text-[11px]" style={{ color: 'var(--taupe)' }}>{form.description.length}/1000</span>
        </div>
        <div>
          <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Краткое описание (excerpt)</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => set('excerpt', e.target.value)}
            rows={2}
            maxLength={500}
            className={inputCls + ' resize-none'}
            style={inputStyle}
            placeholder="Отображается в карточке статьи..."
          />
        </div>
      </div>

      {/* Content */}
      <div className="rounded-xl border p-6" style={{ background: 'white', borderColor: 'var(--line)' }}>
        <h2 className="text-[15px] font-medium mb-4" style={{ color: 'var(--ink)' }}>Содержание (Markdown)</h2>
        <textarea
          required
          value={form.content}
          onChange={(e) => set('content', e.target.value)}
          rows={20}
          className={inputCls + ' resize-y font-mono text-[12px]'}
          style={inputStyle}
          placeholder="## Введение&#10;&#10;Текст статьи на Markdown..."
        />
      </div>

      {/* Meta */}
      <div className="rounded-xl border p-6 grid grid-cols-1 md:grid-cols-2 gap-4" style={{ background: 'white', borderColor: 'var(--line)' }}>
        <div>
          <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Тип контента</label>
          <select value={form.contentType} onChange={(e) => set('contentType', e.target.value)} className={inputCls} style={inputStyle}>
            {CONTENT_TYPES.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Категория</label>
          <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className={inputCls} style={inputStyle}>
            <option value="">— без категории —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Автор</label>
          <select value={form.authorId} onChange={(e) => set('authorId', e.target.value)} className={inputCls} style={inputStyle}>
            <option value="">— без автора —</option>
            {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Теги</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => {
              const checked = form.tagIds.includes(t.id)
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => set('tagIds', checked ? form.tagIds.filter((id) => id !== t.id) : [...form.tagIds, t.id])}
                  className="rounded-full px-3 py-1 text-[12px] border transition-colors"
                  style={{
                    borderColor: checked ? 'var(--accent)' : 'var(--line)',
                    background: checked ? 'var(--sand)' : 'transparent',
                    color: checked ? 'var(--ink)' : 'var(--muted)',
                  }}
                >
                  {t.name}
                </button>
              )
            })}
            {tags.length === 0 && (
              <span className="text-[12px]" style={{ color: 'var(--taupe)' }}>Нет доступных тегов</span>
            )}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Связанные статьи (slug через запятую)</label>
          <input
            value={form.relatedSlugs}
            onChange={(e) => set('relatedSlugs', e.target.value)}
            className={inputCls}
            style={inputStyle}
            placeholder="kak-vybrat-paneli, obrabotka-bas-chastot"
          />
        </div>
        <div>
          <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Время чтения (мин)</label>
          <input
            type="number"
            min={1}
            max={180}
            value={form.readTime}
            onChange={(e) => set('readTime', e.target.value)}
            className={inputCls}
            style={inputStyle}
            placeholder="5"
          />
        </div>
        <div>
          <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--muted)' }}>OG-изображение (URL)</label>
          <input
            value={form.ogImage}
            onChange={(e) => set('ogImage', e.target.value)}
            className={inputCls}
            style={inputStyle}
            placeholder="/images/blog/..."
          />
        </div>
      </div>

      {/* Publish controls */}
      <div className="rounded-xl border p-6 flex flex-wrap items-center gap-6" style={{ background: 'white', borderColor: 'var(--line)' }}>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set('published', e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-[14px] font-medium" style={{ color: 'var(--ink)' }}>Опубликовать</span>
        </label>
        <p className="text-[12px]" style={{ color: 'var(--muted)' }}>
          {form.published ? 'Статья будет видна всем посетителям' : 'Статья сохранится как черновик'}
        </p>
        <button
          type="submit"
          disabled={loading}
          className="ml-auto rounded-lg px-6 py-2.5 text-[14px] font-semibold text-white transition-opacity disabled:opacity-60"
          style={{ background: 'var(--accent)' }}
        >
          {loading ? 'Сохранение...' : isEdit ? 'Сохранить изменения' : 'Создать статью'}
        </button>
      </div>
    </form>
  )
}
