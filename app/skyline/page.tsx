import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import SkylineClient from './SkylineClient'

export const metadata: Metadata = buildMetadata({
  title: 'Калькулятор Skyline-диффузора — 2D расчёт и 3D-превью',
  description: 'Рассчитайте 2D Skyline-диффузор онлайн: карта глубин, изометрическое 3D-превью, таблица раскроя и экспорт CSV. Закажите готовый диффузор или изготовьте сами.',
  path: '/skyline',
})

export default function SkylinePage() {
  return <SkylineClient />
}
