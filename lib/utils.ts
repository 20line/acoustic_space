import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency = '₽'): string {
  return `от ${price.toLocaleString('ru-RU')} ${currency}`
}

export function formatArea(area: number): string {
  return `${area.toLocaleString('ru-RU')} м²`
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '…'
}

export function getImagePlaceholder(width = 8, height = 5): string {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#EBE0CE"/></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://akusto.ru'
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'ACOUSTIC SPACE'
