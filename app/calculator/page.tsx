import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import CalculatorClient from './CalculatorClient'

export const metadata: Metadata = buildMetadata({
  title: 'Калькулятор акустической обработки — расчёт стоимости',
  description: 'Рассчитайте ориентировочную стоимость акустических панелей для вашего помещения. Введите площадь, высоту потолков и тип панелей — получите бюджет за 30 секунд.',
  path: '/calculator',
})

export default function CalculatorPage() {
  return <CalculatorClient />
}
