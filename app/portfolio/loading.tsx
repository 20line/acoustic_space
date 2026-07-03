export default function PortfolioLoading() {
  return (
    <main className="pt-24">
      <div className="wrap py-4">
        <div className="h-4 w-36 rounded bg-[var(--line)] animate-pulse" />
      </div>
      <section className="pad pt-8">
        <div className="wrap space-y-4 mb-12">
          <div className="h-3 w-28 rounded bg-[var(--line)] animate-pulse" />
          <div className="h-12 w-56 rounded bg-[var(--line)] animate-pulse" />
          <div className="h-4 w-80 rounded bg-[var(--line)] animate-pulse" />
        </div>
        <div className="wrap grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden animate-pulse"
              style={{ background: 'var(--cream-2)' }}
            >
              <div className="aspect-[4/3] bg-[var(--line)]" />
              <div className="p-5 space-y-2">
                <div className="h-5 w-4/5 rounded bg-[var(--line)]" />
                <div className="h-4 w-full rounded bg-[var(--line)]" />
                <div className="h-4 w-1/2 rounded bg-[var(--line)]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
