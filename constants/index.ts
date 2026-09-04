import type { NavItem, Segment } from '@/types'

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Наши решения',
    labelEn: 'Solutions',
    href: '/catalog',
    children: [
      { label: 'Тканевые панели', labelEn: 'Fabric Panels', href: '/catalog/fabric' },
      { label: 'Басовые ловушки', labelEn: 'Bass Traps', href: '/catalog/bass-traps' },
      { label: 'Диффузоры', labelEn: 'Diffusers', href: '/catalog/diffusers' },
      { label: 'Мобильные решения', labelEn: 'Mobile', href: '/catalog/mobile' },
      { label: 'Комплекты', labelEn: 'Sets', href: '/catalog/sets' },
      { label: 'Услуги', labelEn: 'Services', href: '/catalog/services' },
    ],
  },
  {
    label: 'Для кого',
    labelEn: 'For Whom',
    href: '/segments',
    children: [
      { label: 'Домашний кинотеатр', labelEn: 'Home Theater', href: '/segments/home-theater' },
      { label: 'Студия звукозаписи', labelEn: 'Recording Studio', href: '/segments/studio' },
      { label: 'Hi-Fi комната', labelEn: 'Hi-Fi Room', href: '/segments/hifi' },
      { label: 'Офисы и переговорные', labelEn: 'Offices', href: '/segments/office' },
      { label: 'Рестораны и lounge', labelEn: 'Restaurants', href: '/segments/restaurant' },
      { label: 'Репетиционные базы', labelEn: 'Rehearsal', href: '/segments/rehearsal' },
    ],
  },
  {
    label: 'Инструменты',
    labelEn: 'Tools',
    href: '/room-designer',
    children: [
      { label: 'Акустический проект помещения', labelEn: 'Room Designer', href: '/room-designer' },
      { label: 'Калькулятор стоимости', labelEn: 'Cost Calculator', href: '/calculator' },
      { label: 'Калькулятор диффузора Шрёдера (QRD)', labelEn: 'Schroeder / QRD Calculator', href: '/diffuser' },
      { label: 'Калькулятор диффузора Skyline', labelEn: 'Skyline Calculator', href: '/skyline' },
    ],
  },
  { label: 'Блог', labelEn: 'Blog', href: '/blog' },
  { label: 'Контакты', labelEn: 'Contacts', href: '/contacts' },
]

// Compact list for the mobile menu quick-access grid (calculators are otherwise
// only reachable from the footer, which sits very deep on phones).
export const MOBILE_TOOLS = [
  { label: 'Стоимость обработки', href: '/calculator', icon: '₽' },
  { label: 'Диффузор Шрёдера (QRD)', href: '/diffuser', icon: '▦' },
  { label: 'Диффузор Skyline', href: '/skyline', icon: '⛰' },
  { label: 'Акустический проект', href: '/room-designer', icon: '▢' },
] as const

export const FOOTER_LINKS = {
  solutions: [
    { label: 'Тканевые панели', href: '/catalog/fabric' },
    { label: 'Басовые ловушки', href: '/catalog/bass-traps' },
    { label: 'Диффузоры', href: '/catalog/diffusers' },
    { label: 'Мобильные решения', href: '/catalog/mobile' },
    { label: 'Комплекты', href: '/catalog/sets' },
    { label: 'Услуги', href: '/catalog/services' },
  ],
  segments: [
    { label: 'Домашний кинотеатр', href: '/segments/home-theater' },
    { label: 'Студия звукозаписи', href: '/segments/studio' },
    { label: 'Hi-Fi комната', href: '/segments/hifi' },
    { label: 'Офисы и переговорные', href: '/segments/office' },
    { label: 'Рестораны и lounge', href: '/segments/restaurant' },
    { label: 'Репетиционные базы', href: '/segments/rehearsal' },
  ],
  company: [
    { label: 'О компании', href: '/about' },
    { label: 'Портфолио', href: '/portfolio' },
    { label: 'Блог', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Контакты', href: '/contacts' },
  ],
  tools: [
    { label: 'Акустический проект помещения', href: '/room-designer' },
    { label: 'Калькулятор стоимости', href: '/calculator' },
    { label: 'Калькулятор QRD', href: '/diffuser' },
    { label: 'Калькулятор Skyline', href: '/skyline' },
  ],
}

export const SEGMENTS: Segment[] = [
  { id: 'home-theater', slug: 'home-theater', title: 'Домашний кинотеатр', description: 'Объёмное звучание без гула и эха', image: '/images/segments/home-theater.jpg', bgClass: 'seg-bg-1', href: '/segments/home-theater' },
  { id: 'studio', slug: 'studio', title: 'Студия звукозаписи', description: 'Контрольная комната по измерениям', image: '/images/segments/studio.jpg', bgClass: 'seg-bg-2', href: '/segments/studio' },
  { id: 'hifi', slug: 'hifi', title: 'Hi-Fi комната', description: 'Точная сцена и чистый бас', image: '/images/segments/hifi.jpg', bgClass: 'seg-bg-3', href: '/segments/hifi' },
  { id: 'office', slug: 'office', title: 'Офисы и переговорные', description: 'Разборчивость речи и комфорт', image: '/images/segments/office.jpg', bgClass: 'seg-bg-4', href: '/segments/office' },
  { id: 'restaurant', slug: 'restaurant', title: 'Рестораны и lounge', description: 'Атмосфера без акустического шума', image: '/images/segments/restaurant.jpg', bgClass: 'seg-bg-5', href: '/segments/restaurant' },
  { id: 'rehearsal', slug: 'rehearsal', title: 'Репетиционные базы', description: 'Изоляция и управляемая акустика', image: '/images/segments/rehearsal.jpg', bgClass: 'seg-bg-6', href: '/segments/rehearsal' },
]

export const CLIENTS = [
  { name: 'Студия А', id: 'a' },
  { name: 'Кинотеатр Б', id: 'b' },
  { name: 'Лейбл В', id: 'c' },
  { name: 'Концертный зал', id: 'd' },
  { name: 'Архбюро', id: 'e' },
  { name: 'Резиденция', id: 'f' },
]

export const PROCESS_STEPS = [
  { number: '01', title: 'Замер', description: 'Геометрия, материалы и текущие измерения помещения.' },
  { number: '02', title: 'Расчёт', description: 'Моделирование диффузии, поглощения и низких частот.' },
  { number: '03', title: 'Проект', description: 'Раскладка панелей, визуализация и спецификация.' },
  { number: '04', title: 'Производство', description: 'Изготовление на собственном участке под объект.' },
  { number: '05', title: 'Монтаж', description: 'Установка и контрольное измерение результата.' },
]

export const STATS = [
  { value: '14', label: 'лет практики', description: 'От домашних кинотеатров до студий звукозаписи' },
  { value: '300+', label: 'объектов', description: 'С подтверждённым измерением результата' },
  { value: 'RT60', label: 'расчёт под объект', description: 'Моделируем поведение звука до производства' },
  { value: '100%', label: 'своё производство', description: 'Контроль геометрии и материала на каждом этапе' },
]

export const ROOM_TYPES = [
  'Домашний кинотеатр', 'Студия звукозаписи', 'Домашняя студия звукозаписи',
  'Hi-Fi комната', 'Переговорная комната', 'Офисное пространство',
  'Ресторан / кафе', 'Репетиционная база', 'Другое',
]

export const PANEL_TYPES = [
  { value: 'fabric', label: 'Тканевые панели', pricePerSqm: 9500 },
  { value: 'bass-traps', label: 'Басовые ловушки', pricePerSqm: 12600 },
  { value: 'diffusers', label: 'Диффузоры', pricePerSqm: 12900 },
  { value: 'mixed', label: 'Комплексная обработка', pricePerSqm: 11500 },
]
