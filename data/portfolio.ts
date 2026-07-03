import type { PortfolioProject } from '@/types'

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'rezonans-studio',
    slug: 'studiya-rezonans-moskva',
    category: 'studio',
    title: 'Контрольная комната «Резонанс»',
    location: 'Москва',
    area: 28,
    description:
      'Профессиональная контрольная комната для многодорожечной записи и сведения. Исходное время реверберации RT60 составляло 0,85 с при неравномерной АЧХ. После обработки — 0,32 с с отклонением не более ±2 дБ в диапазоне 100–8000 Гц.',
    challenge:
      'Студия располагалась в жилом здании с параллельными стенами и низкими потолками, что создавало выраженные модальные резонансы в диапазоне 80–200 Гц.',
    solution:
      'Угловые басовые ловушки из каменной ваты 100 мм во всех вертикальных углах. Тканевые панели на боковых стенах в зоне первых отражений. QRD-диффузоры 700×1200 мм на задней стене. Реечные панели на потолке.',
    result:
      'RT60 снизилось с 0,85 до 0,32 с. Выровнена АЧХ в области 80–250 Гц. Исчезли флаттер-эхо между параллельными стенами.',
    images: [
      '/images/portfolio/rezonans/main.jpg',
      '/images/portfolio/rezonans/front.jpg',
      '/images/portfolio/rezonans/side.jpg',
      '/images/portfolio/rezonans/ceiling.jpg',
    ],
    thumbnail: '/images/portfolio/rezonans/thumb.jpg',
    panelsUsed: ['Реечные панели «Дуб натуральный»', 'Тканевые панели «Графит»', 'QRD-диффузоры', 'Угловые басовые ловушки'],
    year: 2025,
    tags: ['студия', 'контрольная комната', 'Москва'],
  },
  {
    id: 'sochi-cinema',
    slug: 'kinoteatr-sochi-rezidenzia',
    category: 'home-theater',
    title: 'Частная резиденция',
    location: 'Сочи',
    area: 65,
    description:
      'Домашний кинотеатр класса Dolby Atmos 9.4.6 в частном доме на черноморском побережье. Полный акустический контур зала с оптимальным временем реверберации для кино — RT60 = 0,38 с.',
    challenge:
      'Большой объём зала (325 м³) с высокими потолками и панорамным остеклением создавал значительные проблемы с отражениями и плохой разборчивостью диалогов.',
    solution:
      'Тканевые панели по периметру с поглощающим наполнителем 60 мм. Художественные реечные панели на боковых стенах. Фальш-потолок с акустическими плитами. Изоляция от внешнего шума — виброизолированная конструкция пола и стен.',
    result:
      'Достигнут RT60 = 0,38 с, рекомендованный для кинотеатров. STI (Speech Transmission Index) = 0,78. Изоляция от внешних шумов — 52 дБ.',
    images: [
      '/images/portfolio/sochi-cinema/main.jpg',
      '/images/portfolio/sochi-cinema/screen.jpg',
      '/images/portfolio/sochi-cinema/rear.jpg',
      '/images/portfolio/sochi-cinema/detail.jpg',
    ],
    thumbnail: '/images/portfolio/sochi-cinema/thumb.jpg',
    panelsUsed: ['Реечные панели «Орех»', 'Тканевые панели «Антрацит»', 'Художественные панели «Рельеф»'],
    year: 2025,
    tags: ['кинотеатр', 'резиденция', 'Сочи', 'Dolby Atmos'],
  },
  {
    id: 'spb-hifi',
    slug: 'komnata-proslushivaniya-spb',
    category: 'hifi',
    title: 'Комната прослушивания',
    location: 'Санкт-Петербург',
    area: 22,
    description:
      'Выделенная комната прослушивания Hi-Fi для высококачественной двухканальной системы с акустикой Focal Utopia III Evo. Симметричная схема панелей обеспечивает идеальную стереосцену.',
    challenge:
      'Узкая прямоугольная комната (4×5,5 м) с выраженными боковыми отражениями, размывавшими стереосцену, и басовым пиком на 80 Гц.',
    solution:
      'Симметричная расстановка тканевых панелей в точках первых отражений. Угловые ловушки для устранения пика 80 Гц. Реечные панели с шагом 25 мм как декоративный рассеиватель на задней стене.',
    result:
      'Ширина стереобазы увеличилась в 1,5 раза. Устранён пик 80 Гц (-14 дБ). Запас по уровню до перегрузки вырос на 6 дБ благодаря снижению уровня отражений.',
    images: [
      '/images/portfolio/spb-hifi/main.jpg',
      '/images/portfolio/spb-hifi/speakers.jpg',
      '/images/portfolio/spb-hifi/detail.jpg',
    ],
    thumbnail: '/images/portfolio/spb-hifi/thumb.jpg',
    panelsUsed: ['Реечные панели «Дуб беленый»', 'Тканевые панели «Слоновая кость»', 'Угловые басовые ловушки'],
    year: 2024,
    tags: ['Hi-Fi', 'прослушивание', 'Санкт-Петербург'],
  },
  {
    id: 'moscow-office',
    slug: 'ofis-peregovornaya-moskva',
    category: 'office',
    title: 'Переговорная LEVEL',
    location: 'Москва, Москва-Сити',
    area: 35,
    description:
      'Флагманская переговорная комната для крупной IT-компании в башне Москва-Сити. Акустическая обработка обеспечивает идеальную разборчивость речи при видеоконференциях.',
    challenge:
      'Стеклянные перегородки и жёсткие поверхности создавали эхо, ухудшавшее восприятие речи. STI исходный = 0,52.',
    solution:
      'Тканевые панели на потолке и стенах в фирменных цветах компании. Акустический ковёр. Звукоизолирующий стеклопакет 52 мм вместо стандартного.',
    result:
      'STI вырос с 0,52 до 0,84 (отличная разборчивость). Уровень шума снизился с 42 до 36 дБА. Полностью устранено эхо при видеозвонках.',
    images: [
      '/images/portfolio/moscow-office/main.jpg',
      '/images/portfolio/moscow-office/detail.jpg',
    ],
    thumbnail: '/images/portfolio/moscow-office/thumb.jpg',
    panelsUsed: ['Тканевые панели «Терракота»', 'Реечные панели «Ясень»'],
    year: 2024,
    tags: ['офис', 'переговорная', 'Москва-Сити'],
  },
  {
    id: 'restaurant-lounge',
    slug: 'restoran-lounge-piter',
    category: 'restaurant',
    title: 'Ресторан NOMA',
    location: 'Санкт-Петербург',
    area: 180,
    description:
      'Акустическая обработка пространства ресторана скандинавской кухни. Задача — создать атмосферу уюта без акустического шума при полной посадке.',
    challenge:
      'Открытое пространство с высокими потолками и бетонным полом давало RT60 = 1,8 с. При полной посадке уровень шума достигал 76 дБА.',
    solution:
      'Потолочные тканевые «облака» над зонами посадки. Реечные панели на стенах как декоративный элемент и акустический рассеиватель. Акустические плиты в технических зонах.',
    result:
      'RT60 снизилось с 1,8 до 0,7 с. Уровень шума при полной посадке — 64 дБА. Разборчивость за соседними столами — субъективно «в два раза лучше».',
    images: [
      '/images/portfolio/noma/main.jpg',
      '/images/portfolio/noma/ceiling.jpg',
      '/images/portfolio/noma/detail.jpg',
    ],
    thumbnail: '/images/portfolio/noma/thumb.jpg',
    panelsUsed: ['Реечные панели «Ясень беленый»', 'Тканевые панели «Серо-бежевый»'],
    year: 2023,
    tags: ['ресторан', 'lounge', 'Санкт-Петербург'],
  },
  {
    id: 'rehearsal-base',
    slug: 'repetitsionnaya-baza-kazan',
    category: 'rehearsal',
    title: 'Репетиционная база «Октава»',
    location: 'Казань',
    area: 40,
    description:
      'Профессиональная репетиционная база с тремя изолированными студиями. Полная звукоизоляция между залами и оптимизированная внутренняя акустика для работы с живой музыкой.',
    challenge:
      'Звукоизоляция между студиями требовалась на уровне 65 дБ, при этом внутренняя акустика должна была быть комфортной для музыкантов без «мёртвой» атмосферы.',
    solution:
      'Двойные стены с виброизолирующим соединением. Тканевые панели на стенах. Реечные диффузоры на потолке. RT60 целевой = 0,45 с.',
    result:
      'Звукоизоляция между залами — 67 дБ. RT60 = 0,42 с. Отзыв музыкантов: «как в профессиональной студии».',
    images: [
      '/images/portfolio/oktava/main.jpg',
      '/images/portfolio/oktava/detail.jpg',
    ],
    thumbnail: '/images/portfolio/oktava/thumb.jpg',
    panelsUsed: ['Тканевые панели «Графит»', 'Реечные панели «Дуб копченый»', 'Угловые басовые ловушки'],
    year: 2023,
    tags: ['репетиционная', 'база', 'Казань', 'изоляция'],
  },
]

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return portfolioProjects.find((p) => p.slug === slug)
}

export function getProjectsByCategory(category: string): PortfolioProject[] {
  if (category === 'all') return portfolioProjects
  return portfolioProjects.filter((p) => p.category === category)
}
