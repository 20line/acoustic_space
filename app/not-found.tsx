import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center text-center"
      style={{ background: 'var(--cream)' }}
    >
      <span
        className="text-[clamp(80px,15vw,160px)] font-semibold leading-none"
        style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--sand)' }}
      >
        404
      </span>
      <h1
        className="mt-4 text-[clamp(24px,3vw,38px)] font-semibold"
        style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
      >
        Страница не найдена
      </h1>
      <p className="mt-3 text-[16px] max-w-xs" style={{ color: 'var(--muted)' }}>
        Возможно, она была перемещена или больше не существует.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link href="/" className="btn btn-dark">
          На главную
        </Link>
        <Link href="/catalog" className="btn btn-out">
          В каталог
        </Link>
      </div>
    </div>
  )
}
