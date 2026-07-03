# АКУСТО — Инструкция по запуску

## Требования

- Node.js 20+ (скачать: https://nodejs.org)
- npm 10+ (идёт вместе с Node.js)

---

## 1. Установка

```bash
cd akusto
npm install
```

---

## 2. Настройка переменных окружения

Скопируйте `.env.example` в `.env.local` и заполните:

```bash
cp .env.example .env.local
```

Обязательные переменные:

```env
NEXT_PUBLIC_SITE_URL=https://akusto.ru       # ваш домен
NEXT_PUBLIC_PHONE=+79001234567               # телефон
NEXT_PUBLIC_PHONE_DISPLAY=+7 900 123-45-67
NEXT_PUBLIC_EMAIL=hello@akusto.ru
NEXT_PUBLIC_TELEGRAM=https://t.me/akusto
NEXT_PUBLIC_WHATSAPP=https://wa.me/79001234567

TELEGRAM_BOT_TOKEN=                          # токен бота от @BotFather
TELEGRAM_CHAT_ID=                            # ID чата/канала для заявок
RESEND_API_KEY=                              # для отправки email (resend.com)
```

---

## 3. Замена изображений

Все изображения хранятся в папке `public/images/`.

Структура:

```
public/images/
├── hero/
│   └── hero-main.jpg          ← главное фото героя (1920×1080)
├── catalog/
│   ├── slatted/               ← реечные панели
│   ├── fabric/                ← тканевые панели  
│   ├── artistic/              ← художественные
│   ├── bass-traps/            ← басовые ловушки
│   └── diffusers/             ← диффузоры
├── portfolio/                 ← проекты (папка по slug)
├── segments/                  ← для кого (home-theater, studio, etc.)
├── about/                     ← фото производства и команды
├── reviews/                   ← видеоотзыв
└── og/                        ← OpenGraph (1200×630)
```

**Просто замените файлы .jpg на свои фотографии с теми же именами.**

Рекомендуемые размеры:
- Hero: 1920×1080 px, WebP/JPEG
- Каталог (thumb): 800×550 px
- Каталог (full): 1200×800 px
- Портфолио (thumb): 800×600 px
- Портфолио (main): 1400×900 px
- Сегменты: 600×800 px (вертикальные)
- О компании: 900×600 px
- OG-изображение: 1200×630 px

---

## 4. Запуск в режиме разработки

```bash
npm run dev
```

Открыть: http://localhost:3000

---

## 5. Сборка для продакшена

```bash
npm run build
npm run start
```

---

## 6. Деплой на Vercel

```bash
# Установить Vercel CLI
npm i -g vercel

# Авторизация
vercel login

# Деплой
vercel --prod
```

Или подключите GitHub репозиторий в дашборде Vercel — деплой будет автоматическим при каждом пуше.

**Переменные окружения** добавьте в Vercel Dashboard → Settings → Environment Variables.

---

## 7. Обновление контента

### Тексты и данные
Все тексты хранятся в файлах:
- `data/products.ts` — каталог продукции
- `data/portfolio.ts` — портфолио проектов
- `data/reviews.ts` — отзывы
- `data/faq.ts` — FAQ
- `constants/index.ts` — навигация, контакты, клиенты

### Контакты
Измените в `.env.local`:
- `NEXT_PUBLIC_PHONE`
- `NEXT_PUBLIC_EMAIL`
- `NEXT_PUBLIC_TELEGRAM`
- `NEXT_PUBLIC_WHATSAPP`

---

## 8. Структура страниц

| URL | Описание |
|-----|----------|
| `/` | Главная |
| `/catalog` | Каталог |
| `/catalog/slatted` | Реечные панели |
| `/catalog/slatted/[slug]` | Карточка товара |
| `/portfolio` | Портфолио |
| `/portfolio/[slug]` | Страница проекта |
| `/configurator` | Конфигуратор |
| `/calculator` | Калькулятор |
| `/about` | О компании |
| `/contacts` | Контакты |
| `/faq` | FAQ |
| `/blog` | Блог |
| `/privacy` | Политика |

---

## 9. CMS (по желанию)

Проект готов к подключению любой headless CMS:
- **Sanity**: `npm install @sanity/client`
- **Strapi**: REST/GraphQL API уже работает со стандартным fetch
- **Payload CMS**: `npm install payload`
- **Contentful**: `npm install contentful`

Замените данные из `data/*.ts` на запросы к API.

---

## 10. Настройка Telegram-бота

1. Создайте бота у @BotFather → получите `TELEGRAM_BOT_TOKEN`
2. Добавьте бота в нужный чат/канал
3. Получите `TELEGRAM_CHAT_ID`: отправьте сообщение и откройте:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
4. Добавьте в `.env.local`

---

## Поддержка

Все файлы полностью готовы к деплою. После:
1. `npm install`
2. Заполнения `.env.local`
3. Замены изображений в `public/images/`

Сайт готов к деплою на Vercel.
