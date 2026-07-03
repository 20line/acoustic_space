import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import RoomDesignerClient from './RoomDesignerClient'

export const metadata: Metadata = buildMetadata({
  title: 'Акустический проект помещения — 2D-план, RT60, список панелей',
  description: 'Спроектируйте акустическую обработку онлайн: нарисуйте план помещения, расставьте панели, рассчитайте RT60 и получите список материалов с ценами.',
  path: '/room-designer',
})

export default function RoomDesignerPage() {
  return <RoomDesignerClient />
}
