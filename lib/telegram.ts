interface TelegramMessage {
  name: string
  phone: string
  email: string
  telegram?: string
  roomType: string
  comment?: string
}

interface OrderItemLine {
  productName: string
  quantity: number
  /** kopecks */
  unitPrice: number
  config?: unknown
}

interface OrderNotification {
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string | null
  items: OrderItemLine[]
  /** all amounts in kopecks */
  subtotal: number
  deliveryFee: number
  promoDiscount: number
  total: number
  deliveryType: string
  deliveryAddress?: string | null
  paymentMethod: string
  promoCode?: string | null
  comment?: string | null
  invoiceNumber?: string | null
  legal?: {
    name?: string | null
    inn?: string | null
    kpp?: string | null
    address?: string | null
  }
  /** Absolute URL to the order in the admin panel */
  adminUrl?: string
}

const DELIVERY_LABELS: Record<string, string> = {
  PICKUP: 'Самовывоз',
  COURIER: 'Курьер',
  TRANSPORT: 'Транспортная компания',
}

const PAYMENT_LABELS: Record<string, string> = {
  CARD: 'Картой онлайн',
  SBP: 'СБП',
  INVOICE: 'Счёт (юрлицо)',
}

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function rub(kopecks: number): string {
  return (kopecks / 100).toLocaleString('ru-RU') + ' ₽'
}

function formatConfig(config: unknown): string {
  if (!config || typeof config !== 'object') return ''
  const entries = Object.entries(config as Record<string, unknown>)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => `${k}: ${String(v)}`)
  return entries.length ? ` (${escapeHtml(entries.join(', '))})` : ''
}

async function sendToTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.log('[DEV TELEGRAM]\n' + text.replace(/<\/?[^>]+>/g, ''))
    return true
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })
    if (!res.ok) {
      console.error('[telegram] sendMessage failed', res.status, await res.text().catch(() => ''))
    }
    return res.ok
  } catch (err) {
    console.error('[telegram] sendMessage error', err)
    return false
  }
}

export async function sendTelegramNotification(data: TelegramMessage): Promise<boolean> {
  const text = [
    '🎯 <b>Новая заявка с сайта ACOUSTIC SPACE</b>',
    '',
    `👤 <b>Имя:</b> ${escapeHtml(data.name)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(data.phone)}`,
    data.email ? `📧 <b>Email:</b> ${escapeHtml(data.email)}` : '',
    data.telegram ? `✈️ <b>Telegram:</b> ${escapeHtml(data.telegram)}` : '',
    data.roomType ? `🏠 <b>Тип помещения:</b> ${escapeHtml(data.roomType)}` : '',
    data.comment ? `💬 <b>Комментарий:</b> ${escapeHtml(data.comment)}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return sendToTelegram(text)
}

export async function sendOrderTelegram(data: OrderNotification): Promise<boolean> {
  const itemLines = data.items
    .map(
      (i) =>
        `  • ${escapeHtml(i.productName)}${formatConfig(i.config)} — ${i.quantity} шт. × ${rub(
          i.unitPrice,
        )} = <b>${rub(i.unitPrice * i.quantity)}</b>`,
    )
    .join('\n')

  const legalLines: string[] = []
  if (data.legal?.name || data.legal?.inn) {
    legalLines.push('', '🏢 <b>Юрлицо:</b>')
    if (data.legal.name) legalLines.push(`  Название: ${escapeHtml(data.legal.name)}`)
    if (data.legal.inn) legalLines.push(`  ИНН: ${escapeHtml(data.legal.inn)}`)
    if (data.legal.kpp) legalLines.push(`  КПП: ${escapeHtml(data.legal.kpp)}`)
    if (data.legal.address) legalLines.push(`  Юр. адрес: ${escapeHtml(data.legal.address)}`)
    if (data.invoiceNumber) legalLines.push(`  Счёт №: ${escapeHtml(data.invoiceNumber)}`)
  }

  const text = [
    '🛒 <b>Новый заказ — ACOUSTIC SPACE</b>',
    '',
    `🔖 <b>Заказ №</b> ${escapeHtml(data.orderNumber)}`,
    `👤 <b>Клиент:</b> ${escapeHtml(data.customerName)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(data.customerPhone)}`,
    data.customerEmail ? `📧 <b>Email:</b> ${escapeHtml(data.customerEmail)}` : '',
    '',
    '📦 <b>Состав заказа:</b>',
    itemLines,
    '',
    `Товары: ${rub(data.subtotal)}`,
    data.promoDiscount > 0
      ? `Скидка${data.promoCode ? ` (${escapeHtml(data.promoCode)})` : ''}: −${rub(data.promoDiscount)}`
      : '',
    data.deliveryFee > 0 ? `Доставка: ${rub(data.deliveryFee)}` : '',
    `💰 <b>Итого: ${rub(data.total)}</b>`,
    '',
    `🚚 <b>Доставка:</b> ${DELIVERY_LABELS[data.deliveryType] ?? data.deliveryType}`,
    data.deliveryAddress ? `📍 <b>Адрес:</b> ${escapeHtml(data.deliveryAddress)}` : '',
    `💳 <b>Оплата:</b> ${PAYMENT_LABELS[data.paymentMethod] ?? data.paymentMethod}`,
    data.comment ? `\n💬 <b>Комментарий:</b> ${escapeHtml(data.comment)}` : '',
    ...legalLines,
    data.adminUrl ? `\n🔗 ${escapeHtml(data.adminUrl)}` : '',
  ]
    .filter((l) => l !== '')
    .join('\n')

  return sendToTelegram(text)
}
