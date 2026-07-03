export default function BlogLoading() {
  return (
    <main className="pt-24 pb-16">
      <div className="wrap py-4">
        <div className="h-4 w-48 rounded bg-[var(--line)] animate-pulse" />
      </div>
      <section className="pad pt-8">
        <div className="wrap">
          <div className="mb-10 max-w-[640px] space-y-4">
            <div className="h-3 w-20 rounded bg-[var(--line)] animate-pulse" />
            <div className="h-10 w-3/4 rounded bg-[var(--line)] animate-pulse" />
            <div className="h-4 w-full rounded bg-[var(--line)] animate-pulse" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border p-6 space-y-3 animate-pulse"
                style={{ borderColor: 'var(--line)', background: 'var(--cream-2)' }}
              >
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded-full bg-[var(--line)]" />
                  <div className="h-5 w-12 rounded bg-[var(--line)]" />
                </div>
                <div className="h-6 w-5/6 rounded bg-[var(--line)]" />
                <div className="h-4 w-full rounded bg-[var(--line)]" />
                <div className="h-4 w-4/5 rounded bg-[var(--line)]" />
                <div className="h-4 w-1/3 rounded bg-[var(--line)] mt-4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
