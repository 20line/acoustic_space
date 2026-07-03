'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function BlogAdminActions({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Удалить статью «${title}»? Это действие нельзя отменить.`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch {
      alert('Не удалось удалить статью')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-md px-3 py-1 text-[12px] border transition-colors hover:border-red-400 hover:text-red-600 disabled:opacity-40"
      style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
    >
      {loading ? '...' : 'Удалить'}
    </button>
  )
}
