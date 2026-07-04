import type { Product, ProductColor } from '@/types'

export const FABRIC_COLORS: ProductColor[] = [
  // Белые / кремовые
  { name: 'Белый',             hex: '#F8F6F2' },
  { name: 'Слоновая кость',    hex: '#F5F0E8' },
  { name: 'Кремовый',          hex: '#EDE8DC' },
  { name: 'Жемчужный',         hex: '#E8E4DC' },
  { name: 'Льняной',           hex: '#D4C9B4' },
  // Бежевые / тауп
  { name: 'Бежевый',           hex: '#D4C4A8' },
  { name: 'Песочный',          hex: '#C8B89A' },
  { name: 'Тауп',              hex: '#B0A090' },
  { name: 'Мокко',             hex: '#9A8878' },
  { name: 'Пепельно-бежевый',  hex: '#BEB4AA' },
  // Серые
  { name: 'Светло-серый',      hex: '#D8D4D0' },
  { name: 'Серый',             hex: '#B8B4B0' },
  { name: 'Средне-серый',      hex: '#909090' },
  { name: 'Дымчатый',          hex: '#A0A8B0' },
  { name: 'Тёмно-серый',       hex: '#686868' },
  { name: 'Графит',            hex: '#4A4A4A' },
  { name: 'Антрацит',          hex: '#2C2C2C' },
  { name: 'Чёрный',            hex: '#1A1A1A' },
  // Синие
  { name: 'Небесно-голубой',   hex: '#A8C4D8' },
  { name: 'Стальной синий',    hex: '#7A9FB8' },
  { name: 'Грифельно-синий',   hex: '#5A7A90' },
  { name: 'Морской',           hex: '#4A6A80' },
  { name: 'Синий',             hex: '#3A5470' },
  { name: 'Тёмно-синий',       hex: '#1A3050' },
  { name: 'Индиго',            hex: '#3C3C70' },
  // Зелёные
  { name: 'Мятный',            hex: '#A8C8A8' },
  { name: 'Шалфей',            hex: '#88A888' },
  { name: 'Оливковый',         hex: '#6A7A48' },
  { name: 'Хаки',              hex: '#8A9060' },
  { name: 'Лесной',            hex: '#3A5A30' },
  // Красные / терракота
  { name: 'Пудровый розовый',  hex: '#D8A8A0' },
  { name: 'Терракота',         hex: '#C17A5B' },
  { name: 'Кирпичный',         hex: '#A85840' },
  { name: 'Бургундский',       hex: '#7A2830' },
  // Коричневые
  { name: 'Карамельный',       hex: '#C4904A' },
  { name: 'Коричневый',        hex: '#8A5830' },
  { name: 'Шоколадный',        hex: '#5A3820' },
  // Жёлтые / охра
  { name: 'Охра',              hex: '#C8A048' },
  { name: 'Горчичный',         hex: '#B89030' },
  { name: 'Ржавый',            hex: '#B87040' },
  // Фиолетовые
  { name: 'Лавандовый',        hex: '#B0A0C8' },
  { name: 'Сливовый',          hex: '#7A5880' },
  // Бирюзовые
  { name: 'Бирюзовый',         hex: '#6AA8A0' },
  { name: 'Морская волна',      hex: '#4A8A8A' },
]

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
    freqRange: 'от 80 Гц',
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
    freqRange: '700–8000 Гц',
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
    freqRange: 'от 60 Гц',
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
    freqRange: '600 Гц — 4 кГц',
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
    freqRange: 'от 200 Гц',
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
    colors: FABRIC_COLORS,
    materials: ['Базальтовое волокно', 'Акустическая ткань'],
    finishes: ['Акустически прозрачная ткань'],
    absorptionCoeff: 0.75,
    freqRange: 'от 200 Гц',
    tags: ['ширма', 'запись', 'базальт', 'мобильная', 'подкаст', 'вокал'],
    featured: false,
    relatedIds: ['mobile-wood-frame', 'diffuser-qrd'],
    usageScenarios: ['studio', 'rehearsal'],
  },

  // ─── Акустическая панель с базальтовым наполнителем ───────────────────────
  {
    id: 'panel-bazaltovaya',
    slug: 'panel-bazaltovoe-volokno',
    category: 'fabric',
    name: 'Акустическая панель с базальтовым наполнителем',
    nameEn: 'Basalt Fibre Acoustic Panel',
    tagline: 'Широкополосное поглощение с воздушным зазором',
    description:
      'Акустическая панель с наполнителем из базальтового волокна плотностью 50 кг/м³ и конструктивным воздушным зазором ~2 см. МДФ-каркас с внутренней обрешёткой удерживает наполнитель стабильно на протяжении всего срока службы. Зазор смещает акустическую активность в область нижней середины — туда, где тонкие поглотители теряют эффективность. Более 40 цветов ткани, включая натуральный хлопок и лён.',
    price: 3500,
    priceUnit: 'за шт.',
    images: [
      '/images/catalog/fabric/basalt-1.jpg',
      '/images/catalog/fabric/basalt-2.jpg',
    ],
    thumbnail: '/images/catalog/fabric/basalt-thumb.jpg',
    specs: [
      { label: 'Наполнитель', value: 'Базальтовое волокно, 50 кг/м³' },
      { label: 'Толщина наполнителя', value: '10 см' },
      { label: 'Воздушный зазор', value: '~2 см (конструктивный)' },
      { label: 'Каркас', value: 'МДФ с внутренней обрешёткой' },
      { label: 'Облицовка', value: 'Акустически прозрачная ткань + нетканое полотно' },
      { label: 'Монтаж', value: 'Настенный крепёж в комплекте; потолочный подвес — опционально' },
    ],
    dimensions: [
      { label: 'Размер', value: '120 × 63 × 12 см' },
      { label: 'Общая глубина', value: '12 см' },
    ],
    colors: FABRIC_COLORS,
    materials: ['Базальтовое волокно', 'МДФ', 'Нетканое полотно'],
    finishes: ['Акустическая ткань', 'Натуральный хлопок (опция)', 'Лён (опция)'],
    absorptionCoeff: 0.85,
    freqRange: 'от 200 Гц',
    tags: ['базальт', 'поглощение', 'воздушный зазор', 'широкополосные'],
    featured: false,
    relatedIds: ['panel-premium-rt60', 'bass-trap-corner'],
    usageScenarios: ['studio', 'home-theater', 'hifi', 'office'],
  },

  // ─── Акустическая панель премиум с RT60-замером ───────────────────────────
  {
    id: 'panel-premium-rt60',
    slug: 'panel-premium-rt60',
    category: 'fabric',
    name: 'Акустическая панель премиум с замером RT60',
    nameEn: 'Premium Acoustic Panel with RT60 Measurement',
    tagline: 'Результат в графиках и цифрах — до и после',
    description:
      'Акустическая панель премиум-класса с профессиональным замером RT60 и частотным анализом помещения до и после монтажа. Наполнитель — базальтовое волокно 45 кг/м³ (версия Pro — 80+ кг/м³) или хлопок. Деревянная рама, акустически прозрачная ткань в десятках цветов, фотопечать любого изображения. Размер стандарт 120×63×12 см, производство до 240×125 см. Клиент получает отчёт с двумя наложенными графиками, фиксирующими реальное изменение акустической среды.',
    price: 9900,
    priceUnit: 'за шт.',
    images: [
      '/images/catalog/fabric/premium-1.jpg',
      '/images/catalog/fabric/premium-2.jpg',
      '/images/catalog/fabric/premium-3.jpg',
    ],
    thumbnail: '/images/catalog/fabric/premium-thumb.jpg',
    specs: [
      { label: 'Наполнитель (стандарт)', value: 'Базальтовое волокно, 45 кг/м³' },
      { label: 'Наполнитель Pro', value: 'Базальтовое волокно, 80+ кг/м³ (+2 000 ₽)' },
      { label: 'Наполнитель альтернативный', value: 'Хлопковое волокно (+3 000 ₽)' },
      { label: 'Рама', value: 'Алюминий (стандарт) / Деревянная (+4 000 ₽)' },
      { label: 'Обивка', value: 'Акустически прозрачная ткань, десятки цветов; фотопечать' },
      { label: 'Акустический замер', value: 'RT60 + частотный анализ до и после — включён' },
    ],
    dimensions: [
      { label: 'Стандартный размер', value: '120 × 63 × 12 см' },
      { label: 'Максимальный размер', value: '240 × 125 см' },
      { label: 'Толщина', value: '12 см' },
    ],
    colors: FABRIC_COLORS,
    materials: ['Базальтовое волокно', 'Хлопковое волокно', 'Алюминиевая рама', 'Деревянная рама'],
    finishes: ['Акустическая ткань', 'Фотопечать на ткани'],
    absorptionCoeff: 0.85,
    freqRange: 'от 200 Гц',
    tags: ['премиум', 'RT60', 'замер', 'базальт', 'фотопечать', 'деревянная рама'],
    featured: true,
    relatedIds: ['panel-fotopechat', 'bass-trap-corner', 'diffuser-qrd'],
    usageScenarios: ['studio', 'home-theater', 'hifi', 'office'],
  },

  // ─── Акустическая панель с фотопечатью ───────────────────────────────────
  {
    id: 'panel-fotopechat',
    slug: 'panel-fotopechat',
    category: 'fabric',
    name: 'Акустическая панель с фотопечатью',
    nameEn: 'Acoustic Panel with Photo Print',
    tagline: 'Архитектурная акустика, скрытая за искусством',
    description:
      'Полноцветный принт на акустически прозрачной ткани превращает функциональный поглотитель в полноценный арт-объект. Базальтовый наполнитель 45 или 80+ кг/м³, экологичный хлопок — на выбор. Деревянная рама для галерейного монтажа. Принт выполняется под конкретный интерьерный проект: пейзаж, архитектурная абстракция, фирменный паттерн или произведение современного искусства. Стандарт 120×63×11 см, производство до 240×125 см.',
    price: 9000,
    priceUnit: 'за шт.',
    images: [
      '/images/catalog/fabric/photo-1.jpg',
      '/images/catalog/fabric/photo-2.jpg',
    ],
    thumbnail: '/images/catalog/fabric/photo-thumb.jpg',
    specs: [
      { label: 'Технология печати', value: 'Полноцветная печать на акустически прозрачной ткани' },
      { label: 'Наполнитель (стандарт)', value: 'Базальтовая вата 45 кг/м³' },
      { label: 'Наполнитель Pro', value: 'Базальтовая вата 80+ кг/м³ (+2 000 ₽)' },
      { label: 'Наполнитель эко', value: 'Хлопок (+3 000 ₽)' },
      { label: 'Рама', value: 'Деревянная (+4 000 ₽) или без рамы' },
      { label: 'Монтаж', value: 'Настенный, крепёж в комплекте' },
    ],
    dimensions: [
      { label: 'Стандартный размер', value: '120 × 63 × 11 см' },
      { label: 'Максимальный размер', value: '240 × 125 см' },
      { label: 'Глубина', value: '11 см' },
    ],
    colors: [{ name: 'Фотопечать (любое изображение)', hex: '#7A9FBF' }, ...FABRIC_COLORS],
    materials: ['Базальтовая вата', 'Хлопковый наполнитель'],
    finishes: ['Полноцветная фотопечать на ткани', 'Деревянная рама'],
    absorptionCoeff: 0.80,
    freqRange: 'от 200 Гц',
    tags: ['фотопечать', 'арт-объект', 'принт', 'базальт', 'интерьер'],
    featured: true,
    relatedIds: ['panel-premium-rt60', 'bass-trap-corner'],
    usageScenarios: ['home-theater', 'hifi', 'office', 'restaurant'],
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
    colors: FABRIC_COLORS,
    materials: ['Высокоплотный акустический наполнитель', 'Акустически прозрачная ткань'],
    finishes: ['Акустически прозрачная ткань'],
    absorptionCoeff: 0.88,
    freqRange: 'от 80 Гц',
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
  // ─── Skyline 3D диффузор ─────────────────────────────────────────────────
  {
    id: 'skyline-diffuser',
    slug: 'diffuzor-skyline-3d',
    category: 'diffusers',
    name: 'Диффузор Skyline 3D',
    nameEn: 'Skyline 3D Diffuser',
    tagline: 'Двумерное рассеивание в горизонтальной и вертикальной плоскостях',
    description:
      'Потолочный диффузор Skyline с двумерным рассеиванием по принципу числовых последовательностей. Массив объёмных элементов различной высоты создаёт пространственный рассеивающий рельеф, эффективно работая в двух плоскостях одновременно. Применяется преимущественно на потолке и задних стенах студий мониторинга и Hi-Fi комнат. Материал — берёзовая фанера или МДФ с шпоном.',
    price: 18500,
    priceUnit: 'за шт.',
    images: [
      '/images/catalog/diffusers/skyline-1.jpg',
      '/images/catalog/diffusers/skyline-2.jpg',
    ],
    thumbnail: '/images/catalog/diffusers/skyline-thumb.jpg',
    specs: [
      { label: 'Тип', value: 'Skyline 2D, числовая последовательность' },
      { label: 'Рабочий диапазон', value: '800–10000 Гц' },
      { label: 'Рассеивание', value: 'Двумерное (горизонталь + вертикаль)' },
      { label: 'Материал', value: 'Берёзовая фанера / МДФ + шпон' },
      { label: 'Монтаж', value: 'Потолочный или настенный' },
    ],
    dimensions: [
      { label: 'Ширина × Высота', value: '600 × 600 мм' },
      { label: 'Максимальная глубина', value: '120 мм' },
    ],
    colors: [
      { name: 'Берёза натуральная', hex: '#E8D5A3' },
      { name: 'Дуб', hex: '#C4A47A' },
      { name: 'Белый', hex: '#F5F5F5' },
      { name: 'Чёрный', hex: '#1A1A1A' },
    ],
    materials: ['Берёзовая фанера', 'МДФ + шпон'],
    finishes: ['Масло-воск', 'Лак матовый', 'Краска'],
    absorptionCoeff: 0.08,
    freqRange: '800–10000 Гц',
    tags: ['диффузор', 'Skyline', '3D', 'потолок', 'двумерное рассеивание'],
    featured: true,
    relatedIds: ['diffuzor-qrd-7', 'diffuser-qrd', 'bass-trap-corner'],
    usageScenarios: ['studio', 'home-theater', 'hifi'],
  },

  // ─── PRD диффузор ─────────────────────────────────────────────────────────
  {
    id: 'prd-diffuser',
    slug: 'diffuzor-prd-pervichnyj-koren',
    category: 'diffusers',
    name: 'Диффузор PRD (первичный корень)',
    nameEn: 'PRD Primitive Root Diffuser',
    tagline: 'Широкополосное рассеивание без окрашивания звука',
    description:
      'Диффузор на основе последовательности первичных корней (Primitive Root Diffuser). Обеспечивает более широкую полосу рассеивания по сравнению с классическим QRD и меньшую глубину при сопоставимой эффективности. Применяется на боковых стенах студий, кинотеатров и Hi-Fi комнат как замена жёстких отражающих поверхностей. Материал — МДФ с финишным лаком или шпоном.',
    price: 13800,
    priceUnit: 'за шт.',
    images: [
      '/images/catalog/diffusers/prd-1.jpg',
      '/images/catalog/diffusers/prd-2.jpg',
    ],
    thumbnail: '/images/catalog/diffusers/prd-thumb.jpg',
    specs: [
      { label: 'Тип', value: 'PRD (Primitive Root Diffuser)' },
      { label: 'Рабочий диапазон', value: '500–6000 Гц' },
      { label: 'Преимущество', value: 'Меньшая глубина при широкой полосе' },
      { label: 'Материал', value: 'МДФ + шпон / лак' },
      { label: 'Монтаж', value: 'Настенный' },
    ],
    dimensions: [
      { label: 'Ширина × Высота', value: '400 × 1200 мм' },
      { label: 'Глубина', value: '80 мм' },
    ],
    colors: [
      { name: 'Дуб', hex: '#C4A47A' },
      { name: 'Орех', hex: '#6B4226' },
      { name: 'Белый', hex: '#F5F5F5' },
      { name: 'Антрацит', hex: '#3D3D3D' },
    ],
    materials: ['МДФ', 'Шпон дуба/ореха'],
    finishes: ['Шпон + масло', 'Лак матовый', 'Краска'],
    absorptionCoeff: 0.09,
    freqRange: '500–6000 Гц',
    tags: ['диффузор', 'PRD', 'первичный корень', 'широкая полоса', 'боковые стены'],
    featured: false,
    relatedIds: ['diffuser-qrd', 'diffuzor-qrd-7', 'skyline-diffuser'],
    usageScenarios: ['studio', 'home-theater', 'hifi'],
  },
]

export const productCategories = [
  { slug: 'fabric',     label: 'Тканевые панели',   icon: '▤' },
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
