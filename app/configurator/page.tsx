import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import ConfiguratorClient from './ConfiguratorClient'

export const metadata: Metadata = buildMetadata({
  title: 'Конфигуратор акустических панелей — выберите цвет и размер',
  description: 'Подберите акустические панели для вашего интерьера: выберите цвет, размер и отделку в интерактивном конфигураторе. Получите предложение с персональным расчётом.',
  path: '/configurator',
})

export default function ConfiguratorPage() {
  return <ConfiguratorClient />
}
