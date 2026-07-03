import { RevealWrapper } from '@/components/ui/RevealWrapper'

const ADVANTAGES = [
  {
    number: '01',
    title: 'Акустический расчёт',
    description: 'Моделируем RT60 и поведение звука до производства. Не на глаз — по измерениям: замер помещения, расчёт, визуализация.',
  },
  {
    number: '02',
    title: 'Собственное производство',
    description: 'Контролируем каждый этап: выбор материалов, геометрию, технологию сборки и контрольный замер после монтажа.',
  },
  {
    number: '03',
    title: 'Натуральные материалы',
    description: 'Шпон ценных пород дерева, архитектурные ткани европейских марок, сертифицированные акустические наполнители.',
  },
  {
    number: '04',
    title: 'Проект под объект',
    description: 'Каждая раскладка панелей индивидуальна. Учитываем геометрию, назначение, дизайн помещения и пожелания клиента.',
  },
  {
    number: '05',
    title: 'Гарантия результата',
    description: 'Измеряем акустику до и после установки. Если целевые параметры не достигнуты — корректируем за наш счёт.',
  },
  {
    number: '06',
    title: '14 лет практики',
    description: '300+ реализованных объектов: студии, домашние кинотеатры, рестораны, офисы. Решения для типовых и нестандартных задач.',
  },
]

export function AdvantagesSection() {
  return (
    <section className="pad border-t" style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}>
      <div className="wrap">
        <RevealWrapper className="mb-14 max-w-[600px]">
          <span className="eyebrow block mb-4">Почему ACOUSTIC SPACE</span>
          <h2
            className="text-[clamp(32px,4.5vw,56px)] font-semibold leading-tight"
            style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
          >
            Почему важно работать с нами
          </h2>
        </RevealWrapper>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((adv, i) => (
            <RevealWrapper key={adv.number} delay={i * 60}>
              <div className="flex flex-col gap-4 border-t pt-6" style={{ borderColor: 'var(--line)' }}>
                <span
                  className="text-[11px] tracking-[0.2em] uppercase"
                  style={{ color: 'var(--accent)' }}
                >
                  {adv.number}
                </span>
                <h3
                  className="text-[22px] font-semibold leading-tight"
                  style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
                >
                  {adv.title}
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {adv.description}
                </p>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}
