'use client'

import Link from 'next/link'

interface ConsentCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  id?: string
  className?: string
}

/**
 * Mandatory 152-ФЗ consent checkbox. Render it on every form that submits
 * personal data; block submission until `checked` is true.
 */
export function ConsentCheckbox({ checked, onChange, id = 'pd-consent', className = '' }: ConsentCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-2.5 text-[12px] leading-relaxed cursor-pointer ${className}`}
      style={{ color: 'var(--muted)' }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 flex-shrink-0 rounded"
        style={{ accentColor: 'var(--accent)' }}
      />
      <span>
        Я соглашаюсь на{' '}
        <Link href="/consent" target="_blank" className="underline underline-offset-2 hover:text-accent">
          обработку персональных данных
        </Link>{' '}
        и принимаю{' '}
        <Link href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-accent">
          политику конфиденциальности
        </Link>
        .
      </span>
    </label>
  )
}
