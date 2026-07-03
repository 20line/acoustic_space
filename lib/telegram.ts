interface TelegramMessage {
  name: string
  phone: string
  email: string
  telegram?: string
  roomType: string
  comment?: string
}

interface OrderNotification {
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: Array<{ productName: string; quantity: number }>
  total: number
  deliveryType: string
  paymentMethod: string
  promoCode?: string | null
}

const DELIVERY_LABELS: Record<string, string> = {
  PICKUP: 'Самовывоз',
  COURIER: 'Курьер',
  TRANSPORT: 'ТК',
}

const PAYMENT_LABELS: Record<string, string> = {
  CARD: 'Картой онлайн',
  SBP: 'СБП',
  INVOICE: 'Счёт (юрлицо)',
}

async function sendToTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.log('[DEV TELEGRAM]\n' + text)
    return true
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function sendTelegramNotification(data: TelegramMessage): Promise<boolean> {
  const text = [
    '🎯 *Новая заявка с сайта ACOUSTIC SPACE*',
    '',
    `👤 *Имя:* ${escapeMarkdown(data.name)}`,
    `📞 *Телефон:* ${escapeMarkdown(data.phone)}`,
    `📧 *Email:* ${escapeMarkdown(data.email)}`,
    data.telegram ? `✈️ *Telegram:* ${escapeMarkdown(data.telegram)}` : '',
    `🏠 *Тип помещения:* ${escapeMarkdown(data.roomType)}`,
    data.comment ? `💬 *Комментарий:* ${escapeMarkdown(data.comment)}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return sendToTelegram(text)
}

export async function sendOrderTelegram(data: OrderNotification): Promise<boolean> {
  const itemLines = data.items.map((i) => `  • ${i.productName} × ${i.quantity}`).join('\n')
  const text = [
    '🛒 *Новый заказ — ACOUSTIC SPACE*',
    '',
    `🔖 *№* ${escapeMarkdown(data.orderNumber)}`,
    `👤 *Клиент:* ${escapeMarkdown(data.customerName)}`,
    `📞 *Телефон:* ${escapeMarkdown(data.customerPhone)}`,
    data.customerEmail ? `📧 *Email:* ${escapeMarkdown(data.customerEmail)}` : '',
    '',
    `📦 *Состав:*\n${itemLines}`,
    '',
    `💰 *Итого:* ${escapeMarkdown((data.total / 100).toLocaleString('ru-RU'))} ₽`,
    `🚚 *Доставка:* ${DELIVERY_LABELS[data.deliveryType] ?? data.deliveryType}`,
    `💳 *Оплата:* ${PAYMENT_LABELS[data.paymentMethod] ?? data.paymentMethod}`,
    data.promoCode ? `🎁 *Промокод:* ${escapeMarkdown(data.promoCode)}` : '',
  ]
    .filter((l) => l !== '')
    .join('\n')

  return sendToTelegram(text)
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')
}
