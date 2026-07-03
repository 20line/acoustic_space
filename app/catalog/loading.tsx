export default function CatalogLoading() {
  return (
    <main className="pt-24">
      <div className="wrap py-4">
        <div className="h-4 w-36 rounded bg-[var(--line)] animate-pulse" />
      </div>
      <section className="pad pt-8">
        <div className="wrap space-y-4 mb-12">
          <div className="h-3 w-28 rounded bg-[var(--line)] animate-pulse" />
          <div className="h-12 w-72 rounded bg-[var(--line)] animate-pulse" />
          <div className="h-4 w-96 rounded bg-[var(--line)] animate-pulse" />
        </div>
        <div className="wrap">
          {Array.from({ length: 2 }).map((_, ci) => (
            <div key={ci} className="mb-20">
              <div className="flex items-end justify-between mb-8 border-b pb-4" style={{ borderColor: 'var(--line)' }}>
                <div className="space-y-2">
                  <div className="h-3 w-8 rounded bg-[var(--line)] animate-pulse" />
                  <div className="h-8 w-56 rounded bg-[var(--line)] animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[8px] overflow-hidden animate-pulse"
                    style={{ background: 'var(--cream-2)' }}
                  >
                    <div className="aspect-[16/11] bg-[var(--line)]" />
                    <div className="p-6 space-y-3">
                      <div className="h-6 w-3/4 rounded bg-[var(--line)]" />
                      <div className="h-4 w-full rounded bg-[var(--line)]" />
                      <div className="flex justify-between">
                        <div className="h-4 w-24 rounded bg-[var(--line)]" />
                        <div className="h-4 w-16 rounded bg-[var(--line)]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
