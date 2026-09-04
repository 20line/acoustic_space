import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { buildMetadata } from '@/lib/metadata'
import { CONTACTS } from '@/lib/contacts'

export const metadata: Metadata = buildMetadata({
  title: 'Согласие на обработку персональных данных',
  path: '/consent',
  noIndex: true,
})

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'ACOUSTIC SPACE'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://akusto.ru'

export default function ConsentPage() {
  return (
    <>
      <ProgressBar />
      <Header />
      <main className="pt-24 pb-20">
        <div className="wrap py-4">
          <nav className="flex gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <span>Согласие на обработку персональных данных</span>
          </nav>
        </div>

        <div className="wrap max-w-3xl">
          <h1
            className="mt-8 mb-8 text-[clamp(28px,4vw,48px)] font-semibold"
            style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
          >
            Согласие на обработку персональных данных
          </h1>

          <p className="mb-6 text-[13px]" style={{ color: 'var(--muted)' }}>
            Редакция от 1 сентября 2026 г.
          </p>

          <div className="prose max-w-none space-y-6 text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
            <p>
              Проставляя отметку «Я согласен(на) на обработку персональных данных» и отправляя форму
              на сайте <strong style={{ color: 'var(--ink)' }}>{SITE_NAME}</strong> ({SITE_URL}),
              я, субъект персональных данных, действуя свободно, своей волей и в своём интересе,
              даю согласие оператору — <strong style={{ color: 'var(--ink)' }}>{SITE_NAME}</strong> —
              на обработку моих персональных данных на условиях, изложенных ниже.
            </p>

            <div>
              <h2 className="mb-2 text-[18px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                Перечень персональных данных
              </h2>
              <ul className="ml-4 list-disc space-y-1">
                <li>фамилия, имя;</li>
                <li>номер телефона;</li>
                <li>адрес электронной почты;</li>
                <li>адрес доставки;</li>
                <li>идентификатор в мессенджере Telegram (при добровольном указании);</li>
                <li>реквизиты юридического лица — при запросе счёта;</li>
                <li>содержание заявки и приложенные файлы.</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-2 text-[18px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                Цели обработки
              </h2>
              <ul className="ml-4 list-disc space-y-1">
                <li>обработка заявок и заказов, подготовка расчёта и коммерческого предложения;</li>
                <li>связь со мной по телефону, электронной почте или в Telegram по вопросам заявки;</li>
                <li>заключение и исполнение договора, выставление счетов, организация доставки;</li>
                <li>ведение клиентского учёта и улучшение качества сервиса.</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-2 text-[18px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                Действия с персональными данными и способ обработки
              </h2>
              <p>
                Согласие даётся на совершение следующих действий: сбор, запись, систематизация,
                накопление, хранение, уточнение (обновление, изменение), извлечение, использование,
                передачу (предоставление, доступ) курьерским службам, транспортным компаниям и
                платёжным операторам в объёме, необходимом для исполнения заявки, блокирование,
                удаление, уничтожение. Обработка ведётся как с использованием средств автоматизации,
                так и без них. Данные могут передаваться в сервис мессенджера Telegram для
                уведомления оператора о поступившей заявке.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-[18px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
                Срок действия и отзыв согласия
              </h2>
              <p>
                Согласие действует с момента отправки формы и до достижения целей обработки либо до
                его отзыва. Я вправе отозвать согласие, направив письменное уведомление на адрес{' '}
                <a href={`mailto:${CONTACTS.email}`} className="underline underline-offset-2 hover:text-accent">
                  {CONTACTS.email}
                </a>
                . После отзыва оператор прекращает обработку и уничтожает данные, если иное не
                предусмотрено законодательством РФ.
              </p>
            </div>

            <p>
              Настоящее согласие дано в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ
              «О персональных данных». Порядок обработки данных описан в{' '}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-accent">
                Политике конфиденциальности
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
