import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types/cart'
import { ORDER_STATUS_LABELS, ORDER_STATUS_STEP } from '@/types/cart'

const STEPS: OrderStatus[] = [
  'NEW', 'DESIGN', 'APPROVAL', 'PRODUCTION',
  'PAINTING', 'PACKING', 'SHIPPING', 'INSTALLATION', 'DONE',
]

export function OrderStatusTracker({ status }: { status: OrderStatus }) {
  if (status === 'CANCELLED') {
    return (
      <div className="rounded-[8px] px-4 py-3 text-[13px] font-semibold text-red-600" style={{ background: '#fef2f2' }}>
        Заказ отменён
      </div>
    )
  }

  const currentStep = ORDER_STATUS_STEP[status]

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex min-w-[600px] items-center">
        {STEPS.map((step, i) => {
          const stepNum = ORDER_STATUS_STEP[step]
          const done = stepNum < currentStep
          const active = stepNum === currentStep

          return (
            <div key={step} className="flex flex-1 items-center">
              {/* Node */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all',
                    done && 'text-white',
                    active && 'text-white ring-4',
                    !done && !active && 'border-2',
                  )}
                  style={{
                    background: done ? 'var(--accent)' : active ? 'var(--ink)' : 'transparent',
                    borderColor: !done && !active ? 'var(--line)' : undefined,
                    color: !done && !active ? 'var(--muted)' : undefined,
                    outline: active ? '3px solid var(--ink)' : undefined,
                    outlineOffset: active ? '2px' : undefined,
                  }}
                >
                  {done ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={cn(
                    'whitespace-nowrap text-[10px] text-center leading-tight',
                    active ? 'font-semibold' : '',
                  )}
                  style={{ color: active ? 'var(--ink)' : done ? 'var(--accent)' : 'var(--muted)' }}
                >
                  {ORDER_STATUS_LABELS[step]}
                </span>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div
                  className="mx-1 mb-5 h-[2px] flex-1 rounded-full transition-all"
                  style={{ background: done ? 'var(--accent)' : 'var(--line)' }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
