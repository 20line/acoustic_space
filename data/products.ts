import type { Product } from '@/types'

export const products: Product[] = [
  {
    id: 'bass-trap-corner',
    slug: 'basovye-lovushki-uglovye',
    category: 'bass-traps',
    name: 'Угловые басовые ловушки',
    nameEn: 'Corner Bass Traps',
    tagline: 'Контроль низких частот в угловых зонах',
    description:
      'Угловые басовые ловушки для поглощения низкочастотных резонансов (80–250 Гц). Размещаются в вертикальных углах помещения, где концентрация стоячих волн максимальна. Облицовка тканью или шпоном в цвет интерьера.',
    price: 12600,
    priceUnit: 'за погонный метр',
    images: [
      '/images/catalog/bass-traps/corner-1.jpg',
      '/images/catalog/bass-traps/corner-2.jpg',
    ],
    thumbnail: '/images/catalog/bass-traps/corner-thumb.jpg',
    specs: [
      { label: 'Наполнитель', value: 'Каменная вата 100 мм, ρ=80 кг/м³' },
      { label: 'Рабочий диапазон', value: '80–500 Гц' },
      { label: 'Монтаж', value: 'Угловой (вертикальный)' },
    ],
    dimensions: [
      { label: 'Сечение треугольника', value: '300×300 мм' },
      { label: 'Высота секции', value: '1200 мм' },
    ],
    colors: [
      { name: 'Слоновая кость', hex: '#F5F0E8' },
      { name: 'Серо-бежевый', hex: '#C8BDB0' },
      { name: 'Графит', hex: '#4A4A4A' },
    ],
    materials: ['Каменная вата', 'Стекловолокно'],
    finishes: ['Ткань', 'Шпон', 'Краска'],
    absorptionCoeff: 0.95,
    tags: ['басовые ловушки', 'низкие частоты', 'углы'],
    featured: false,
    relatedIds: ['diffuser-qrd', 'tube-trap'],
    usageScenarios: ['studio', 'home-theater', 'hifi', 'rehearsal'],
  },
  {
    id: 'diffuser-qrd',
    slug: 'diffuzory-qrd',
    category: 'diffusers',
    name: 'Диффузоры QRD',
    nameEn: 'QRD Diffusers',
    tagline: 'Квадратичный остаточный диффузор',
    description:
      'Диффузоры по принципу квадратичных остаточных последовательностей для равномерного рассеивания звука. Заменяют жёсткие отражающие поверхности на рассеивающие, сохраняя ощущение «живого» акустического пространства.',
    price: 11400,
    priceUnit: 'за м²',
    images: [
      '/images/catalog/diffusers/qrd-1.jpg',
      '/images/catalog/diffusers/qrd-2.jpg',
    ],
    thumbnail: '/images/catalog/diffusers/qrd-thumb.jpg',
    specs: [
      { label: 'Тип', value: 'QRD 1D, период n=7' },
      { label: 'Рабочий диапазон', value: '700–8000 Гц' },
      { label: 'Материал', value: 'МДФ + шпон / массив' },
    ],
    dimensions: [
      { label: 'Ширина', value: '700 мм (модуль n=7)' },
      { label: 'Высота', value: '600 / 1200 мм' },
      { label: 'Глубина', value: '120 мм' },
    ],
    colors: [
      { name: 'Дуб', hex: '#C4A47A' },
      { name: 'Белый', hex: '#F5F5F5' },
      { name: 'Чёрный', hex: '#1A1A1A' },
    ],
    materials: ['МДФ + шпон', 'Массив'],
    finishes: ['Масло-воск', 'Лак матовый', 'Краска'],
    absorptionCoeff: 0.1,
    tags: ['диффузоры', 'QRD', 'рассеивание'],
    featured: false,
    relatedIds: ['diffuzor-qrd-7', 'bass-trap-corner'],
    usageScenarios: ['studio', 'home-theater', 'hifi'],
  },

  // ─── Tube Trap ────────────────────────────────────────────────────────────
  {
    id: 'tube-trap',
    slug: 'tube-trap-basovaya-lovushka',
    category: 'bass-traps',
    name: 'Tube Trap — цилиндрическая басовая ловушка',
    nameEn: 'Tube Trap — Cylindrical Bass Trap',
    tagline: 'Поглощение на перепаде давления + диффузия средних частот',
    description:
      'Цилиндрическая басовая ловушка диаметром 300 мм с герметичным корпусом из незвенящей стали. Работает на перепаде давления, а не как пористый поглотитель — обеспечивает эффективное поглощение низких частот при компактных габаритах. Цилиндрическая форма одновременно рассеивает средние и высокие частоты. Версия Luxury: крышка из массива ореха или дуба с глянцевым лаком. Высота и цвет корпуса — по индивидуальному запросу.',
    price: 10000,
    priceUnit: 'за шт.',
    images: [
      '/images/catalog/bass-traps/tube-trap-1.jpg',
      '/images/catalog/bass-traps/tube-trap-2.jpg',
    ],
    thumbnail: '/images/catalog/bass-traps/tube-trap-thumb.jpg',
    specs: [
      { label: 'Конструкция', value: 'Герметичный цилиндрический корпус, незвенящая сталь' },
      { label: 'Принцип работы', value: 'Поглощение на перепаде давления (pressure-based)' },
      { label: 'Диаметр', value: '300 мм' },
      { label: 'Высота', value: 'По запросу (индивидуальная конфигурация)' },
      { label: 'Версия Luxury', value: 'Крышка из массива ореха или дуба, глянцевый лак' },
      { label: 'Цвет корпуса', value: 'По запросу' },
    ],
    dimensions: [
      { label: 'Диаметр', value: '300 мм' },
      { label: 'Высота', value: 'Индивидуальная' },
    ],
    colors: [
      { name: 'Чёрный (сталь)', hex: '#1A1A1A' },
      { name: 'Орех (Luxury)', hex: '#6B4226' },
      { name: 'Дуб (Luxury)', hex: '#C4A47A' },
    ],
    materials: ['Незвенящая сталь', 'Массив ореха (Luxury)', 'Массив дуба (Luxury)'],
    finishes: ['Порошковая покраска', 'Глянцевый лак (Luxury)'],
    absorptionCoeff: 0.90,
    tags: ['tube trap', 'цилиндр', 'давление', 'бас', 'диффузия', 'luxury'],
    featured: true,
    relatedIds: ['bass-trap-corner', 'diffuser-qrd'],
    usageScenarios: ['studio', 'home-theater', 'hifi'],
  },

  // ─── QRD-7 диффузор ───────────────────────────────────────────────────────
  {
    id: 'diffuzor-qrd-7',
    slug: 'diffuzor-qrd-7-shredera',
    category: 'diffusers',
    name: 'Рассеивающая панель QRD-7 (диффузор Шредера)',
    nameEn: 'QRD-7 Schroeder Diffuser Panel',
    tagline: 'Математически точное рассеивание 600 Гц — 4 кГц',
    description:
      'Диффузор Шредера седьмого порядка (QRD) с геометрией ячеек по математической последовательности квадратичных вычетов. Рабочий диапазон 600 Гц — 4 кГц. Облицован акустической радиотканью 150T: снаружи — нейтральная архитектурная поверхность, внутри — точно спроектированный инструмент из фанерных ячеек. Устраняет флаттер-эхо, стоячие волны и паразитные отражения без потери живости и объёма звука.',
    price: 15000,
    priceUnit: 'за шт.',
    images: [
      '/images/catalog/diffusers/qrd7-1.jpg',
      '/images/catalog/diffusers/qrd7-2.jpg',
    ],
    thumbnail: '/images/catalog/diffusers/qrd7-thumb.jpg',
    specs: [
      { label: 'Тип', value: 'Диффузор Шредера 7-го порядка (QRD)' },
      { label: 'Рабочий диапазон', value: '600 Гц — 4 кГц' },
      { label: 'Принцип расчёта', value: 'Квадратичные вычеты (Quadratic Residue Diffuser)' },
      { label: 'Материал ячеек', value: 'Фанера берёзовая' },
      { label: 'Облицовка', value: 'Акустическая радиоткань 150T' },
      { label: 'Монтаж', value: 'Настенный, вертикальная ориентация' },
    ],
    dimensions: [
      { label: 'Ширина × Высота × Глубина', value: '48,6 × 123 × 16 см' },
    ],
    colors: [
      { name: 'Радиоткань (нейтральная)', hex: '#C8C0B8' },
    ],
    materials: ['Берёзовая фанера', 'Акустическая радиоткань 150T'],
    finishes: ['Облицовка тканью 150T'],
    absorptionCoeff: 0.12,
    tags: ['QRD', 'диффузор', 'Шредер', '7 порядок', 'рассеивание', '600 Гц'],
    featured: true,
    relatedIds: ['diffuser-qrd', 'bass-trap-corner'],
    usageScenarios: ['studio', 'home-theater', 'hifi'],
  },

  // ─── Мобильные панели Wood Frame ─────────────────────────────────────────
  {
    id: 'mobile-wood-frame',
    slug: 'mobilnye-paneli-wood-frame',
    category: 'mobile',
    name: 'Мобильные акустические панели Wood Frame',
    nameEn: 'Mobile Acoustic Panels Wood Frame',
    tagline: 'Архитектурная акустика, которая движется вместе с вами',
    description:
      'Напольные мобильные акустические экраны с каркасом из натурального дерева. Высота 208 см, ширина 104 см, толщина 12 см. Двустороннее исполнение без видимых швов — одинаково презентабельны с любой стороны. Встроенные колёсики с фиксатором. Не требуют монтажа. Позволяют мгновенно менять конфигурацию студии, переговорной, репетиционной базы или домашнего кинотеатра.',
    price: 32000,
    priceUnit: 'за шт.',
    images: [
      '/images/catalog/mobile/wood-frame-1.jpg',
      '/images/catalog/mobile/wood-frame-2.jpg',
    ],
    thumbnail: '/images/catalog/mobile/wood-frame-thumb.jpg',
    specs: [
      { label: 'Конструкция', value: 'Напольная, на колёсиках с фиксатором' },
      { label: 'Исполнение', value: 'Двустороннее, без видимых швов' },
      { label: 'Материал каркаса', value: 'Натуральное дерево, финишная отделка' },
      { label: 'Монтаж', value: 'Не требуется' },
    ],
    dimensions: [
      { label: 'Высота', value: '208 см' },
      { label: 'Ширина', value: '104 см' },
      { label: 'Толщина', value: '12 см' },
    ],
    colors: [
      { name: 'Натуральное дерево', hex: '#C4A47A' },
      { name: 'Индивидуальная отделка', hex: '#888888' },
    ],
    materials: ['Натуральное дерево', 'Акустический наполнитель'],
    finishes: ['Финишная отделка дерева', 'Кастомная обивка (под заказ)'],
    absorptionCoeff: 0.80,
    tags: ['мобильные', 'напольные', 'Wood Frame', 'студия', 'колёсики'],
    featured: false,
    relatedIds: ['bass-trap-corner', 'diffuser-qrd', 'shirma-zapisi'],
    usageScenarios: ['studio', 'rehearsal', 'office', 'home-theater'],
  },

  // ─── Акустическая ширма для записи ───────────────────────────────────────
  {
    id: 'shirma-zapisi',
    slug: 'shirma-dlya-zapisi-3-sektsii',
    category: 'mobile',
    name: 'Акустическая ширма для записи, 3-секционная',
    nameEn: 'Recording Acoustic Screen, 3-Section',
    tagline: 'Контролируемая звуковая среда без компромиссов',
    description:
      'Складная 3-секционная акустическая ширма с высокоплотным базальтовым волокном. Каждая секция 200×63×6 см. Общая ширина в развёрнутом виде — 189 см. Создаёт локальную контролируемую зону вокруг источника звука, устраняя ранние отражения в ближнем поле микрофона. Более 50 цветов ткани, двустороннее исполнение под заказ. Складывается по принципу книжного переплёта, не требует монтажа.',
    price: 19000,
    priceUnit: 'за комплект',
    images: [
      '/images/catalog/mobile/shirma-1.jpg',
      '/images/catalog/mobile/shirma-2.jpg',
    ],
    thumbnail: '/images/catalog/mobile/shirma-thumb.jpg',
    specs: [
      { label: 'Наполнитель', value: 'Высокоплотное базальтовое волокно' },
      { label: 'Обивка', value: 'Акустически прозрачная ткань, 50+ цветов' },
      { label: 'Двустороннее исполнение', value: 'Доступно под заказ' },
      { label: 'Конструкция', value: 'Складная, книжного типа' },
      { label: 'Монтаж', value: 'Не требуется' },
    ],
    dimensions: [
      { label: 'Секций', value: '3 шт.' },
      { label: 'Размер секции', value: '200 × 63 × 6 см' },
      { label: 'Ширина в развёрнутом виде', value: '189 см' },
      { label: 'Высота', value: '200 см' },
    ],
    colors: [
      { name: '50+ цветов ткани', hex: '#C8BDB0' },
      { name: 'Двусторонняя (под заказ)', hex: '#888888' },
    ],
    materials: ['Базальтовое волокно', 'Акустическая ткань'],
    finishes: ['Акустически прозрачная ткань'],
    absorptionCoeff: 0.75,
    tags: ['ширма', 'запись', 'базальт', 'мобильная', 'подкаст', 'вокал'],
    featured: false,
    relatedIds: ['mobile-wood-frame', 'diffuser-qrd'],
    usageScenarios: ['studio', 'rehearsal'],
  },

  // ─── Комплект для мини-студии ─────────────────────────────────────────────
  {
    id: 'komplekt-mini-studiya',
    slug: 'komplekt-akustiki-mini-studiya',
    category: 'sets',
    name: 'Комплект акустических панелей для мини-студии',
    nameEn: 'Acoustic Kit for Mini Studio',
    tagline: '8 широкополосных панелей + 4 бас-ловушки для помещений до 18 м²',
    description:
      'Профессиональная система акустического контроля для помещений до 16–18 м². В состав входят 8 широкополосных поглощающих панелей (120×63×12 см) и 4 угловые бас-ловушки (60×60×120 см). Устраняет стоячие волны, неравномерность АЧХ и избыточное время реверберации без самостоятельных акустических расчётов. Инженерный баланс поглощения заложен в состав и пропорции комплекта.',
    price: 61202,
    priceUnit: 'за комплект',
    images: [
      '/images/catalog/sets/mini-studio-1.jpg',
      '/images/catalog/sets/mini-studio-2.jpg',
    ],
    thumbnail: '/images/catalog/sets/mini-studio-thumb.jpg',
    specs: [
      { label: 'Широкополосные панели', value: '8 шт. / 120 × 63 × 12 см' },
      { label: 'Угловые бас-ловушки', value: '4 шт. / 60 × 60 × 120 см' },
      { label: 'Рекомендуемая площадь', value: 'до 16–18 м²' },
      { label: 'Назначение', value: 'Широкополосное поглощение + контроль стоячих волн' },
    ],
    dimensions: [
      { label: 'Панели', value: '120 × 63 × 12 см (8 шт.)' },
      { label: 'Бас-ловушки', value: '60 × 60 × 120 см (4 шт.)' },
    ],
    colors: [
      { name: 'По выбору', hex: '#C8BDB0' },
    ],
    materials: ['Высокоплотный акустический наполнитель', 'Акустически прозрачная ткань'],
    finishes: ['Акустически прозрачная ткань'],
    absorptionCoeff: 0.88,
    tags: ['комплект', 'мини-студия', 'бас-ловушки', 'готовое решение', '18 м²'],
    featured: true,
    relatedIds: ['bass-trap-corner', 'diffuzor-qrd-7'],
    usageScenarios: ['studio', 'home-theater', 'hifi'],
  },

  // ─── Студия звукозаписи под ключ ─────────────────────────────────────────
  {
    id: 'studiya-pod-klyuch',
    slug: 'studiya-zvukozapisi-pod-klyuch',
    category: 'services',
    name: 'Студия звукозаписи под ключ',
    nameEn: 'Recording Studio Turnkey',
    tagline: 'Полный инженерный цикл — от замера до верификации результата',
    description:
      'Услуга полного акустического проектирования и оснащения студии звукозаписи. Включает выезд инженера-акустика, высокоточный аудит RT60 и АЧХ в октавных/третьоктавных полосах, проектирование, изготовление кастомных диффузоров Шредера, резонаторов Гельмгольца и мембранных ловушек, монтаж, финальный замер «после» с документацией. Итог — равномерная АЧХ в зоне sweet spot (±3 дБ), RT60 в диапазоне 0,2–0,4 с, верифицированный отчёт.',
    price: 300000,
    priceUnit: 'от (индивидуально)',
    images: [
      '/images/catalog/services/studio-1.jpg',
      '/images/catalog/services/studio-2.jpg',
    ],
    thumbnail: '/images/catalog/services/studio-thumb.jpg',
    specs: [
      { label: 'Акустический аудит', value: 'RT60, АЧХ, комнатные моды — до и после' },
      { label: 'Полосы анализа', value: 'Октавные и третьоктавные 63 Гц — 16 кГц' },
      { label: 'Решения', value: 'Диффузоры Шредера, резонаторы Гельмгольца, мембранные ловушки' },
      { label: 'Изготовление', value: 'Кастомное под параметры конкретного помещения' },
      { label: 'Документация', value: 'Отчёты с графиками «до» и «после»' },
      { label: 'Соответствие', value: 'Международные стандарты для студий мониторинга' },
    ],
    dimensions: [
      { label: 'Площадь помещения', value: 'от 15 м² (индивидуально)' },
    ],
    colors: [
      { name: 'Согласовывается с дизайн-проектом', hex: '#3D3028' },
    ],
    materials: ['Диффузоры Шредера', 'Резонаторы Гельмгольца', 'Мембранные ловушки'],
    finishes: ['Кастомная отделка под интерьер'],
    absorptionCoeff: 0.95,
    tags: ['студия', 'под ключ', 'RT60', 'инженер', 'Гельмгольц', 'Шредер', 'мониторинг'],
    featured: true,
    relatedIds: ['diffuzor-qrd-7', 'tube-trap', 'bass-trap-corner'],
    usageScenarios: ['studio'],
  },
]

export const productCategories = [
  { slug: 'bass-traps', label: 'Басовые ловушки',   icon: '◢' },
  { slug: 'diffusers',  label: 'Диффузоры',         icon: '◫' },
  { slug: 'mobile',     label: 'Мобильные решения', icon: '⊞' },
  { slug: 'sets',       label: 'Комплекты',         icon: '▣' },
  { slug: 'services',   label: 'Услуги',            icon: '◉' },
] as const

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}
