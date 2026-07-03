'use client'

import { useState } from 'react'

interface Props {
  url: string
  title: string
}

export function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--line)' }}>
      <p className="mb-3 text-[13px] font-medium" style={{ color: 'var(--muted)' }}>Поделиться:</p>
      <div className="flex flex-wrap gap-2">
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium border transition-colors hover:border-[#2AABEE] hover:text-[#2AABEE]"
          style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
        >
          Telegram
        </a>
        <a
          href={`https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium border transition-colors hover:border-[#0077FF] hover:text-[#0077FF]"
          style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
        >
          ВКонтакте
        </a>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium border transition-colors hover:border-[var(--accent)] hover:text-accent"
          style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
        >
          {copied ? '✓ Скопировано' : 'Копировать ссылку'}
        </button>
      </div>
    </div>
  )
}
