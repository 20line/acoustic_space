import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { buildMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'Политика конфиденциальности',
  path: '/privacy',
})

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'ACOUSTIC SPACE'
const SITE_EMAIL = process.env.NEXT_PUBLIC_EMAIL ?? 'hello@akusto.ru'

export default function PrivacyPage() {
  return (
    <>
      <ProgressBar />
      <Header />
      <main className="pt-24 pb-20">
        <div className="wrap py-4">
          <nav className="flex gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span>/</span>
            <span>Политика конфиденциальности</span>
          </nav>
        </div>

        <div className="wrap max-w-3xl">
          <h1
            className="mt-8 mb-8 text-[clamp(28px,4vw,48px)] font-semibold"
            style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
          >
            Политика конфиденциальности
          </h1>

          <p className="mb-6 text-[13px]" style={{ color: 'var(--muted)' }}>
            Редакция от 25 июня 2026 г.
          </p>

          <div className="prose max-w-none space-y-8" style={{ color: 'var(--ink)' }}>
            <section>
              <h2 className="mb-3 text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                1. Общие положения
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Настоящая Политика конфиденциальности (далее — «Политика») регулирует порядок обработки
                персональных данных пользователей сайта <strong style={{ color: 'var(--ink)' }}>{SITE_NAME}</strong>,
                расположенного по адресу {process.env.NEXT_PUBLIC_SITE_URL ?? 'akusto.ru'}.
                Политика составлена в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ
                «О персональных данных».
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                2. Какие данные мы собираем
              </h2>
              <p className="mb-2 text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                При использовании сайта и оформлении заказа мы можем обрабатывать следующие данные:
              </p>
              <ul className="ml-4 list-disc space-y-1 text-[14px]" style={{ color: 'var(--muted)' }}>
                <li>Имя и фамилия</li>
                <li>Номер телефона</li>
                <li>Адрес электронной почты</li>
                <li>Адрес доставки</li>
                <li>Реквизиты юридического лица (для выставления счёта)</li>
                <li>Технические данные: IP-адрес, тип браузера, данные cookie-файлов</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                3. Цели обработки данных
              </h2>
              <ul className="ml-4 list-disc space-y-1 text-[14px]" style={{ color: 'var(--muted)' }}>
                <li>Обработка и выполнение заказов, выставление счётов</li>
                <li>Связь с вами по вопросам заказа и доставки</li>
                <li>Технического обеспечение работы сайта (авторизация, корзина)</li>
                <li>Улучшение качества сервиса</li>
              </ul>
              <p className="mt-3 text-[14px]" style={{ color: 'var(--muted)' }}>
                Данные не передаются третьим лицам без вашего согласия, за исключением
                платёжных систем (ЮKassa) и служб доставки, непосредственно участвующих в выполнении заказа.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                4. Файлы cookie
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Сайт использует технические cookie-файлы, необходимые для работы авторизации, корзины
                и хранения пользовательских предпочтений. Без этих файлов сайт не может функционировать
                корректно. Для анализа посещаемости используется Яндекс.Метрика — сервис веб-аналитики
                ООО «Яндекс». Яндекс.Метрика собирает обезличенные данные о действиях пользователей
                (страницы, клики, источники трафика) и устанавливает cookie-файлы на устройство.
                Политика обработки данных Яндекса: yandex.ru/legal/confidential. Маркетинговые
                и рекламные cookie не используются.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                5. Хранение данных
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Персональные данные хранятся на защищённых серверах. Данные об оплате обрабатываются
                исключительно на стороне платёжного оператора (ЮKassa) и не сохраняются на наших серверах.
                Данные хранятся до тех пор, пока это необходимо для выполнения указанных выше целей или
                соблюдения требований законодательства.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                6. Ваши права
              </h2>
              <p className="mb-2 text-[14px]" style={{ color: 'var(--muted)' }}>
                В соответствии с 152-ФЗ вы вправе:
              </p>
              <ul className="ml-4 list-disc space-y-1 text-[14px]" style={{ color: 'var(--muted)' }}>
                <li>Получить информацию об обрабатываемых персональных данных</li>
                <li>Запросить исправление неточных данных</li>
                <li>Потребовать удаления данных («право на забвение»)</li>
                <li>Отозвать согласие на обработку данных</li>
              </ul>
              <p className="mt-3 text-[14px]" style={{ color: 'var(--muted)' }}>
                Для реализации прав свяжитесь с нами:{' '}
                <a href={`mailto:${SITE_EMAIL}`} className="underline underline-offset-2 hover:text-accent">
                  {SITE_EMAIL}
                </a>
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                7. Изменения в Политике
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Мы оставляем за собой право вносить изменения в настоящую Политику. Актуальная версия
                всегда доступна на этой странице. Продолжение использования сайта после публикации изменений
                означает ваше согласие с обновлённой Политикой.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
