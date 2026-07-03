import type { Metadata } from 'next'
import OrderClient from './OrderClient'

export const metadata: Metadata = {
  title: 'Статус заявки · ACOUSTIC SPACE',
  robots: { index: false, follow: false },
}

export default function OrderPage() {
  return <OrderClient />
}
