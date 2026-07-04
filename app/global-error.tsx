'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#F7F2EA', color: '#241B14' }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9A8878' }}>
            Критическая ошибка
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 600, margin: 0 }}>
            Что-то пошло не так
          </h1>
          <p style={{ fontSize: '15px', color: '#9A8878', maxWidth: '420px', lineHeight: 1.6 }}>
            Произошла непредвиденная ошибка. Попробуйте обновить страницу.
          </p>
          {error.digest && (
            <p style={{ fontSize: '12px', color: '#B0A090' }}>Код: {error.digest}</p>
          )}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{ padding: '12px 28px', background: '#7C5232', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            >
              Попробовать снова
            </button>
            <a
              href="/"
              style={{ padding: '12px 28px', border: '1px solid #C8BDB0', color: '#241B14', borderRadius: '6px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
            >
              На главную
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
