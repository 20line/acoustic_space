import { Cormorant_Garamond, Manrope, Montserrat } from 'next/font/google'

export const cormorant = Cormorant_Garamond({
  subsets: ['cyrillic', 'latin'],
  weight: ['500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: true,
})

export const manrope = Manrope({
  subsets: ['cyrillic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
  preload: true,
})

export const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  weight: ['600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: false,
})
