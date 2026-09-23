# ACOUSTIC SPACE — запуск проекта на новом компьютере

Сайт: Next.js 16 (App Router) + Prisma + PostgreSQL (Neon) + NextAuth.
Боевой домен: **acousticspace.ru** · деплой: Vercel, автоматически при пуше в `master`.

---

## 1. Что поставить заранее

| Программа | Версия | Где взять |
|---|---|---|
| Node.js | **20 или 22 LTS** | nodejs.org (ставить вместе с npm) |
| Git | любая свежая | git-scm.com |

Проверка в терминале:

```bash
node -v
npm -v
git --version
```

## 2. Скачать репозиторий

```bash
git clone https://github.com/20line/acoustic_space.git
```

Затем перейти в папку проекта:

```bash
cd acoustic_space/akusto
```

> Код сайта лежит во вложенной папке `akusto`, все команды ниже выполняются из неё.

## 3. Установить зависимости

```bash
npm install
```

Если Prisma не сгенерировался автоматически:

```bash
npx prisma generate
```

## 4. Создать файл `.env` ⚠️ Самое важное

**`.env` намеренно не хранится в Git** — в нём пароли от базы, токен бота и ключи.
Без него сайт запустится, но каталог, корзина и вход работать не будут.

Способы получить:

1. **Скопировать файл со старого ПК** — проще всего. Он лежит в
   `...\site_panels\akusto\.env`. Перенести на флешке или отправить себе в Telegram
   «Избранное», положить в `acoustic_space/akusto/.env`.
2. **Собрать заново** — значения есть в панели Vercel:
   проект → **Settings → Environment Variables**, строка подключения к базе —
   в панели Neon (console.neon.tech).

Список ключей и их назначение — в `.env.example` (он в репозитории).
Минимум, чтобы сайт поднялся локально:

```
DATABASE_URL=...        # строка подключения Neon (pooler)
DIRECT_URL=...          # прямая строка подключения Neon
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...     # любая длинная случайная строка
```

Остальное (Telegram, SMTP, SMS, реквизиты) — по желанию: без них сайт работает,
просто уведомления уходят в консоль, а не в бот/почту.

## 5. Запустить

```bash
npm run dev
```

Открыть http://localhost:3000

Первая загрузка страницы в режиме разработки занимает 5–20 секунд — Next
компилирует её на лету. Это нормально и к боевому сайту отношения не имеет.

## 6. Полезные команды

```bash
npm run dev         # разработка
npm run build       # production-сборка (проверить перед пушем)
npm run start       # запустить production-сборку локально
npm run type-check  # проверка типов TypeScript
```

## 7. Внести правку и выкатить на сайт

```bash
git pull                      # забрать свежие изменения
# ... редактируем файлы ...
npm run type-check            # убедиться, что ничего не сломано
git add -A
git commit -m "что изменил"
git push
```

После пуша в `master` Vercel сам соберёт и выкатит сайт — через 2–3 минуты
изменения будут на acousticspace.ru. Статус сборки: vercel.com → проект →
вкладка **Deployments**.

> При первом `git push` с нового ПК Git спросит логин GitHub — вводится
> не пароль, а **Personal Access Token**: github.com/settings/tokens →
> Generate new token (classic) → отметить `repo` (и `workflow`, если нужно
> править файлы в `.github/`).

## 8. Где что лежит

| Путь | Что там |
|---|---|
| `app/` | страницы и API-маршруты |
| `components/` | переиспользуемые компоненты |
| `data/products.ts` | **каталог товаров и цены** |
| `constants/index.ts` | меню, сегменты, ставки калькулятора |
| `lib/contacts.ts` | телефон, Telegram, email — единое место |
| `lib/telegram.ts` | текст уведомлений о заказах в бот |
| `prisma/schema.prisma` | схема базы данных |
| `styles/globals.css` | глобальные стили и CSS-переменные |
