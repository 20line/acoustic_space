'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Profile { name: string | null; email: string | null; phone: string | null }

export default function ProfileClient() {
  const { data: session, update } = useSession()
  const [profile, setProfile] = useState<Profile>({ name: '', email: '', phone: '' })
  const [form, setForm] = useState({ name: '', email: '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [error, setError] = useState('')
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    fetch('/api/account/profile')
      .then((r) => r.json())
      .then((data) => {
        setProfile(data)
        setForm({ name: data.name ?? '', email: data.email ?? '' })
      })
  }, [])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setMsg(''); setError('')
    const res = await fetch('/api/account/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setError(data.error ?? 'Ошибка'); return }
    setMsg('Сохранено')
    await update({ name: data.name })
    setTimeout(() => setMsg(''), 3000)
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwError('Пароли не совпадают'); return
    }
    setPwSaving(true); setPwMsg(''); setPwError('')
    const res = await fetch('/api/account/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
    })
    const data = await res.json()
    setPwSaving(false)
    if (!res.ok) { setPwError(data.error ?? 'Ошибка'); return }
    setPwMsg('Пароль изменён')
    setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    setTimeout(() => setPwMsg(''), 3000)
  }

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
        Профиль
      </h1>

      {/* Main info */}
      <form onSubmit={saveProfile} className="space-y-4 rounded-2xl border p-6" style={{ borderColor: 'var(--line)' }}>
        <h2 className="text-[15px] font-semibold" style={{ color: 'var(--ink)' }}>Личные данные</h2>

        <Field label="Имя">
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="input-field"
            placeholder="Ваше имя"
          />
        </Field>

        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="input-field"
            placeholder="email@example.com"
          />
        </Field>

        {profile.phone && (
          <Field label="Телефон">
            <input value={profile.phone} disabled className="input-field opacity-60 cursor-not-allowed" />
            <p className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>Телефон изменяется через поддержку</p>
          </Field>
        )}

        {error && <p className="text-[13px] text-red-500">{error}</p>}
        {msg && <p className="text-[13px] text-green-600">{msg}</p>}

        <button
          type="submit"
          disabled={saving}
          className="btn btn-dark"
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>

      {/* Password change */}
      <form onSubmit={savePassword} className="space-y-4 rounded-2xl border p-6" style={{ borderColor: 'var(--line)' }}>
        <h2 className="text-[15px] font-semibold" style={{ color: 'var(--ink)' }}>Смена пароля</h2>

        <Field label="Текущий пароль">
          <input
            type="password"
            value={pwForm.currentPassword}
            onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
            className="input-field"
            autoComplete="current-password"
          />
        </Field>
        <Field label="Новый пароль">
          <input
            type="password"
            value={pwForm.newPassword}
            onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
            className="input-field"
            autoComplete="new-password"
            minLength={6}
          />
        </Field>
        <Field label="Повторите новый пароль">
          <input
            type="password"
            value={pwForm.confirm}
            onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
            className="input-field"
            autoComplete="new-password"
          />
        </Field>

        {pwError && <p className="text-[13px] text-red-500">{pwError}</p>}
        {pwMsg && <p className="text-[13px] text-green-600">{pwMsg}</p>}

        <button type="submit" disabled={pwSaving} className="btn btn-out">
          {pwSaving ? 'Сохранение...' : 'Изменить пароль'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] mb-1.5 font-medium" style={{ color: 'var(--muted)' }}>{label}</label>
      {children}
    </div>
  )
}
