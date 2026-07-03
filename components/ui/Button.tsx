import { type ButtonHTMLAttributes, type AnchorHTMLAttributes, forwardRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'light' | 'dark' | 'outline' | 'ghost-light' | 'ghost-dark'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  loading?: boolean
}

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  href: string
}

const variantClasses: Record<ButtonVariant, string> = {
  light: 'bg-white text-espresso hover:bg-cream',
  dark: 'bg-espresso text-cream hover:bg-[#3a2c20]',
  outline: 'bg-transparent text-ink border-[rgba(44,36,29,0.13)] hover:border-ink',
  'ghost-light': 'bg-transparent text-white border-[rgba(255,255,255,0.35)] hover:bg-white/12',
  'ghost-dark': 'bg-transparent text-ink border-[rgba(44,36,29,0.13)] hover:bg-ink/5',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-5 py-2.5 text-[13px]',
  md: 'px-7 py-3.5 text-[14px]',
  lg: 'px-9 py-4 text-[15px]',
}

const baseClasses =
  'inline-flex items-center gap-2 font-semibold font-sans rounded-full border border-transparent cursor-pointer transition-all duration-300 hover:-translate-y-px active:translate-y-0 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'dark', size = 'md', children, className, loading, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        disabled={disabled ?? loading}
        {...props}
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Отправка...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export function LinkButton({ variant = 'dark', size = 'md', children, className, href, ...props }: LinkButtonProps) {
  return (
    <a
      href={href}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </a>
  )
}
