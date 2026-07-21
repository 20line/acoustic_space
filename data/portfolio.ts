import type { PortfolioProject } from '@/types'

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'studio-project',
    slug: 'studiya-zvukozapisi',
    category: 'studio',
    title: 'Студия звукозаписи',
    location: 'Москва',
    area: 30,
    description:
      'Профессиональная студия звукозаписи с полной акустической обработкой. Контрольная комната и запись — широкополосные панели, басовые ловушки и диффузоры обеспечивают равномерную АЧХ и контролируемое время реверберации.',
    challenge:
      'Параллельные стены и низкие потолки создавали модальные резонансы и флаттер-эхо, ухудшавшие качество мониторинга.',
    solution:
      'Тканевые панели в точках первых отражений. Угловые басовые ловушки во всех вертикальных углах. Диффузоры на задней стене для рассеивания отражений.',
    result:
      'Равномерная АЧХ в зоне мониторинга. Устранены стоячие волны и флаттер-эхо. Комфортная среда для длительных сессий сведения.',
    images: [
      '/images/portfolio/studio/main.jpg',
      '/images/portfolio/studio/detail.jpg',
      '/images/portfolio/studio/front.jpg',
    ],
    thumbnail: '/images/portfolio/studio/thumb.jpg',
    panelsUsed: ['Тканевые панели', 'Угловые басовые ловушки', 'Диффузоры QRD'],
    year: 2025,
    tags: ['студия', 'звукозапись', 'Москва'],
  },
  {
    id: 'hifi-room-project',
    slug: 'hifi-komnata-proslushivaniya',
    category: 'hifi',
    title: 'Hi-Fi комната прослушивания',
    location: 'Москва',
    area: 24,
    description:
      'Комната прослушивания Hi-Fi с симметричной схемой акустической обработки. Панели в точках первых отражений, басовые ловушки в углах, диффузия на задней стене.',
    challenge:
      'Боковые отражения размывали стереосцену, а басовые моды создавали неравномерную АЧХ в зоне прослушивания.',
    solution:
      'Симметричная расстановка тканевых панелей. Угловые басовые ловушки для контроля низких частот. Диффузоры на задней стене.',
    result:
      'Чёткая стереосцена и точная локализация инструментов. Ровный бас без пиков и провалов.',
    images: [
      '/images/portfolio/hifi-room/main.jpg',
      '/images/portfolio/hifi-room/detail.jpg',
    ],
    thumbnail: '/images/portfolio/hifi-room/thumb.jpg',
    panelsUsed: ['Тканевые панели', 'Угловые басовые ловушки', 'Реечные панели'],
    year: 2025,
    tags: ['Hi-Fi', 'прослушивание', 'Москва'],
  },
  {
    id: 'office-project',
    slug: 'ofis-peregovornaya',
    category: 'office',
    title: 'Переговорная комната',
    location: 'Москва',
    area: 35,
    description:
      'Акустическая обработка переговорной комнаты для обеспечения разборчивости речи и комфортной среды для видеоконференций.',
    challenge:
      'Жёсткие поверхности и стеклянные перегородки создавали эхо, ухудшавшее восприятие речи при видеозвонках.',
    solution:
      'Тканевые панели на стенах и потолке. Акустические решения интегрированы в дизайн интерьера.',
    result:
      'Полностью устранено эхо. Отличная разборчивость речи при видеоконференциях.',
    images: [
      '/images/portfolio/office/main.jpg',
      '/images/portfolio/office/detail.jpg',
      '/images/portfolio/office/front.jpg',
      '/images/portfolio/office/side.jpg',
    ],
    thumbnail: '/images/portfolio/office/thumb.jpg',
    panelsUsed: ['Тканевые панели', 'Потолочные панели'],
    year: 2024,
    tags: ['офис', 'переговорная', 'Москва'],
  },
  {
    id: 'rep-base-project',
    slug: 'repetitsionnaya-baza',
    category: 'rehearsal',
    title: 'Репетиционная база',
    location: 'Москва',
    area: 45,
    description:
      'Репетиционная база с акустической обработкой для комфортной работы с живой музыкой. Панели и ловушки обеспечивают контролируемое время реверберации без «мёртвой» атмосферы.',
    challenge:
      'Высокий уровень отражений от стен создавал некомфортную акустическую среду для музыкантов.',
    solution:
      'Тканевые панели на стенах. Басовые ловушки в углах. Баланс поглощения и рассеивания для живого звучания.',
    result:
      'Комфортная акустика для репетиций. Музыканты слышат себя и друг друга без искажений.',
    images: [
      '/images/portfolio/rep-base/main.jpg',
      '/images/portfolio/rep-base/detail.jpg',
      '/images/portfolio/rep-base/front.jpg',
    ],
    thumbnail: '/images/portfolio/rep-base/thumb.jpg',
    panelsUsed: ['Тканевые панели', 'Угловые басовые ловушки'],
    year: 2024,
    tags: ['репетиционная', 'база', 'Москва'],
  },
]

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return portfolioProjects.find((p) => p.slug === slug)
}

export function getProjectsByCategory(category: string): PortfolioProject[] {
  if (category === 'all') return portfolioProjects
  return portfolioProjects.filter((p) => p.category === category)
}
