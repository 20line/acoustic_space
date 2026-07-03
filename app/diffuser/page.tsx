import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import DiffuserClient from './DiffuserClient'

export const metadata: Metadata = buildMetadata({
  title: 'Калькулятор диффузора Шрёдера (QRD) — расчёт ячеек онлайн',
  description: 'Рассчитайте квадратично-остаточный QRD-диффузор онлайн: схема ячеек, глубины, спецификация материалов. Введите частоту и порядок — получите готовый чертёж.',
  path: '/diffuser',
})

export default function DiffuserPage() {
  return <DiffuserClient />
}
