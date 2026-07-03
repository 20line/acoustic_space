'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PHONE = process.env.NEXT_PUBLIC_PHONE ?? '+79777903983'
const TELEGRAM = process.env.NEXT_PUBLIC_TELEGRAM ?? 'https://t.me/akusto'
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? 'https://wa.me/70000000000'

export function FloatingContact() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-2"
          >
            <ContactLink
              href={`tel:${PHONE}`}
              label="Позвонить"
              color="#1a1a1a"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.77 19.79 19.79 0 012 1.18 2 2 0 014 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14z" />
                </svg>
              }
            />
            <ContactLink
              href={TELEGRAM}
              label="Telegram"
              color="#2AABEE"
              target="_blank"
              rel="noopener noreferrer"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.448 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.547l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.978.012z" />
                </svg>
              }
            />
            <ContactLink
              href={WHATSAPP}
              label="WhatsApp"
              color="#25D366"
              target="_blank"
              rel="noopener noreferrer"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((p) => !p)}
        aria-label={open ? 'Закрыть контакты' : 'Связаться с нами'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-premium transition-all duration-300"
        style={{ background: 'var(--espresso)', color: '#fff' }}
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          )}
        </motion.div>

        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--accent)' }} />
          <span className="relative inline-flex h-3 w-3 rounded-full" style={{ background: 'var(--accent)' }} />
        </span>
      </motion.button>
    </div>
  )
}

function ContactLink({
  href,
  label,
  icon,
  color,
  ...props
}: {
  href: string
  label: string
  icon: React.ReactNode
  color: string
  target?: string
  rel?: string
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="group flex h-12 w-12 items-center justify-center rounded-full shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
      style={{ background: color, color: '#fff' }}
      {...props}
    >
      {icon}
    </a>
  )
}
