// Single source of truth for public contact details.
// NEXT_PUBLIC_* vars are inlined at build time, so this module is safe in
// both server and client components.

const rawPhone = process.env.NEXT_PUBLIC_PHONE ?? '+79777903983'

export const CONTACTS = {
  /** E.164-ish phone for tel: links, e.g. +79777903983 */
  phone: rawPhone,
  /** Human-readable phone, e.g. +7 977 790-39-83 */
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? '+7 977 790-39-83',
  email: process.env.NEXT_PUBLIC_EMAIL ?? 'hello@acousticspace.ru',
  /** Full https link to the Telegram account */
  telegram: process.env.NEXT_PUBLIC_TELEGRAM ?? 'https://t.me/acousticspace',
  /** @-handle for display, e.g. @acousticspace */
  telegramHandle: process.env.NEXT_PUBLIC_TELEGRAM_HANDLE ?? '@acousticspace',
  /** Full https link to WhatsApp (same line as the phone) */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? 'https://wa.me/79777903983',
} as const

export const telHref = `tel:${CONTACTS.phone}`
export const mailHref = `mailto:${CONTACTS.email}`
