import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { buildMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'Публичная оферта',
  path: '/terms',
})

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'ACOUSTIC SPACE'
const SITE_EMAIL = process.env.NEXT_PUBLIC_EMAIL ?? 'hello@akusto.ru'
const SITE_PHONE = process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? '+7 977 790-39-83'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'acoustic-space.vercel.app'

export default function TermsPage() {
  return (
    <>
      <ProgressBar />
      <Header />
      <main className="pt-24 pb-20">
        <div className="wrap py-4">
          <nav className="flex gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <span>Публичная оферта</span>
          </nav>
        </div>

        <div className="wrap max-w-3xl">
          <h1
            className="mt-8 mb-8 text-[clamp(28px,4vw,48px)] font-semibold"
            style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
          >
            Публичная оферта
          </h1>

          <p className="mb-6 text-[13px]" style={{ color: 'var(--muted)' }}>
            Редакция от 4 июля 2026 г.
          </p>

          <div className="prose max-w-none space-y-8" style={{ color: 'var(--ink)' }}>

            <section>
              <h2 className="mb-3 text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                1. Общие положения
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Настоящий документ является официальным предложением (публичной офертой) компании{' '}
                <strong style={{ color: 'var(--ink)' }}>{SITE_NAME}</strong>, далее — «Исполнитель»,
                заключить договор об изготовлении и поставке акустических панелей, а также оказании
                сопутствующих услуг (далее — «Договор») с любым лицом, далее — «Заказчик»,
                принявшим условия настоящей оферты.
              </p>
              <p className="mt-3 text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Акцептом оферты является оформление заказа на сайте {SITE_URL}, направление заявки
                через форму обратной связи или иное подтверждение намерения получить товар/услугу.
                С момента акцепта оферта считается договором, обязательным для обеих сторон.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                2. Предмет договора
              </h2>
              <p className="mb-2 text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Исполнитель обязуется по заданию Заказчика:
              </p>
              <ul className="ml-4 list-disc space-y-1 text-[14px]" style={{ color: 'var(--muted)' }}>
                <li>Изготовить акустические панели, диффузоры, басовые ловушки и иные изделия согласно
                  согласованным характеристикам (тип, размер, цвет, материал);</li>
                <li>Передать готовые изделия Заказчику способом, оговорённым при оформлении заказа;</li>
                <li>При заказе услуг — провести акустическое проектирование, измерения или монтаж
                  в соответствии с согласованным техническим заданием.</li>
              </ul>
              <p className="mt-3 text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Заказчик обязуется принять и оплатить товар/услугу в порядке и сроки, предусмотренные
                настоящей офертой.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                3. Цена и порядок оплаты
              </h2>
              <p className="mb-2 text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Цены на изделия и услуги указаны на сайте и носят ориентировочный характер,
                поскольку каждый заказ изготавливается индивидуально. Итоговая стоимость согласовывается
                с Заказчиком перед подтверждением заказа.
              </p>
              <ul className="ml-4 list-disc space-y-1 text-[14px]" style={{ color: 'var(--muted)' }}>
                <li>Предоплата 50% вносится после согласования состава и стоимости заказа;</li>
                <li>Остаток 50% — перед отгрузкой готовых изделий;</li>
                <li>Для услуг (проектирование, монтаж) порядок оплаты оговаривается индивидуально;</li>
                <li>Оплата принимается безналичным переводом на расчётный счёт или через платёжную
                  систему ЮKassa.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                4. Сроки изготовления и доставки
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Сроки изготовления определяются индивидуально в зависимости от состава и сложности
                заказа и сообщаются Заказчику при подтверждении заказа. Стандартный срок —
                от 10 до 30 рабочих дней. Доставка осуществляется транспортными компаниями или
                курьерской службой; стоимость и сроки доставки согласовываются отдельно.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                5. Качество и гарантии
              </h2>
              <p className="mb-2 text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Исполнитель гарантирует:
              </p>
              <ul className="ml-4 list-disc space-y-1 text-[14px]" style={{ color: 'var(--muted)' }}>
                <li>Соответствие изделий согласованным характеристикам и применяемым стандартам;</li>
                <li>Использование материалов заявленного класса и плотности;</li>
                <li>Гарантийный срок на изделия — 12 месяцев с момента передачи Заказчику.</li>
              </ul>
              <p className="mt-3 text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Гарантия не распространяется на дефекты, возникшие вследствие нарушения условий
                эксплуатации, механических повреждений или ненадлежащего монтажа.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                6. Возврат и отмена заказа
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Поскольку изделия изготавливаются по индивидуальному заданию Заказчика, они не подлежат
                обмену и возврату по основаниям, предусмотренным для товаров надлежащего качества
                (п. 4 ст. 26.1 Закона РФ «О защите прав потребителей»). При обнаружении дефектов
                производства Исполнитель обязуется устранить их или заменить изделие за свой счёт
                в разумный срок. Отмена подтверждённого заказа возможна до начала производства;
                внесённая предоплата при этом возвращается за вычетом понесённых расходов на
                материалы и проектирование.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                7. Ответственность сторон
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Стороны несут ответственность за неисполнение или ненадлежащее исполнение
                обязательств в соответствии с законодательством РФ. Исполнитель не несёт
                ответственности за задержки, вызванные обстоятельствами непреодолимой силы
                (форс-мажор), а также действиями третьих лиц (транспортных компаний, поставщиков
                материалов).
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                8. Персональные данные
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Оформляя заказ или отправляя заявку, Заказчик даёт согласие на обработку
                персональных данных в соответствии с{' '}
                <Link href="/privacy" className="underline underline-offset-2 hover:text-accent">
                  Политикой конфиденциальности
                </Link>
                {' '}в объёме, необходимом для исполнения договора.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                9. Разрешение споров
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Все споры разрешаются путём переговоров. При невозможности урегулировать спор
                в досудебном порядке он передаётся на рассмотрение суда по месту нахождения
                Исполнителя в соответствии с законодательством РФ.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                10. Контактные данные
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                По всем вопросам, связанным с исполнением договора:
              </p>
              <ul className="mt-2 ml-4 list-disc space-y-1 text-[14px]" style={{ color: 'var(--muted)' }}>
                <li>Телефон: <a href={`tel:${process.env.NEXT_PUBLIC_PHONE}`} className="underline underline-offset-2 hover:text-accent">{SITE_PHONE}</a></li>
                <li>Email: <a href={`mailto:${SITE_EMAIL}`} className="underline underline-offset-2 hover:text-accent">{SITE_EMAIL}</a></li>
                <li>Сайт: {SITE_URL}</li>
              </ul>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
