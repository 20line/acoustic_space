'use client'

import { useEffect, useState, useCallback } from 'react'

interface AdminUser {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  role: string
  createdAt: string
}

const ROLES = ['CUSTOMER', 'DESIGNER', 'ARCHITECT', 'DEALER', 'ADMIN'] as const
const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: 'Клиент',
  DESIGNER: 'Дизайнер',
  ARCHITECT: 'Архитектор',
  DEALER: 'Дилер',
  ADMIN: 'Администратор',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [q, setQ] = useState('')
  const [inputQ, setInputQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const qs = new URLSearchParams({ page: String(page) })
    if (q) qs.set('q', q)
    const res = await fetch(`/api/admin/users?${qs}`)
    if (res.status === 403) { alert('Нет доступа'); setLoading(false); return }
    const data = await res.json()
    setUsers(data.users)
    setTotal(data.total)
    setPages(data.pages)
    setLoading(false)
  }, [page, q])

  useEffect(() => { load() }, [load])

  async function changeRole(userId: string, role: string) {
    setUpdating(userId)
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, role }),
    })
    setUpdating(null)
    load()
  }

  return (
    <div className="py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-2xl font-semibold text-[#2C2C2C]">Пользователи · {total}</h1>
          <form
            onSubmit={(e) => { e.preventDefault(); setQ(inputQ); setPage(1) }}
            className="flex gap-2"
          >
            <input
              value={inputQ}
              onChange={(e) => setInputQ(e.target.value)}
              placeholder="Поиск по имени, email, телефону"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-[14px] outline-none focus:border-[#8B7355] w-64"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#2C2C2C] px-4 py-2 text-[13px] font-medium text-white"
            >
              Найти
            </button>
            {q && (
              <button
                type="button"
                onClick={() => { setQ(''); setInputQ(''); setPage(1) }}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-[13px] text-gray-500"
              >
                Сбросить
              </button>
            )}
          </form>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-white animate-pulse" />)}
          </div>
        ) : users.length === 0 ? (
          <p className="text-gray-400 text-center py-20">Пользователей нет</p>
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <table className="w-full text-[14px]">
              <thead>
                <tr style={{ background: '#F5F0EB' }}>
                  <th className="px-5 py-3 text-left font-medium text-gray-500 text-[12px]">Пользователь</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500 text-[12px] hidden sm:table-cell">Контакт</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500 text-[12px] hidden md:table-cell">Зарегистрирован</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500 text-[12px]">Роль</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr
                    key={user.id}
                    className="border-t border-gray-50 transition-colors hover:bg-[#FAFAF8]"
                    style={{ borderColor: idx === 0 ? 'transparent' : undefined }}
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-[#2C2C2C]">{user.name ?? '—'}</p>
                      <p className="text-[12px] text-gray-400">{user.id.slice(0, 8)}…</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600 hidden sm:table-cell">
                      <p>{user.email ?? '—'}</p>
                      <p className="text-[12px] text-gray-400">{user.phone ?? ''}</p>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-gray-400 hidden md:table-cell">
                      {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={user.role}
                        disabled={updating === user.id}
                        onChange={(e) => changeRole(user.id, e.target.value)}
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-[13px] disabled:opacity-50"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  p === page ? 'bg-[#2C2C2C] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
