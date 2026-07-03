// ─── Email via Nodemailer ─────────────────────────────────────────────────────
// Set in .env:
//   SMTP_HOST=smtp.yandex.ru
//   SMTP_PORT=465
//   SMTP_USER=info@yoursite.ru
//   SMTP_PASS=your-password
//   SMTP_FROM="Acoustic Space <info@yoursite.ru>"
//
// If SMTP_HOST is not set, emails are logged to console only (dev mode).

import nodemailer from 'nodemailer'

function createTransport() {
  if (!process.env.SMTP_HOST) return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: Number(process.env.SMTP_PORT ?? 465) === 465,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  })
}

export async function sendMail(options: {
  to: string
  subject: string
  html: string
}): Promise<boolean> {
  const from = process.env.SMTP_FROM ?? 'Acoustic Space <noreply@acousticspace.ru>'

  if (!process.env.SMTP_HOST) {
    console.log(`[DEV EMAIL] to: ${options.to}\nsubject: ${options.subject}\n---`)
    return true
  }

  try {
    const transport = createTransport()!
    await transport.sendMail({ from, ...options })
    return true
  } catch (err) {
    console.error('[mailer]', err)
    return false
  }
}

// ─── Templates ────────────────────────────────────────────────────────────────

export function orderConfirmHtml(params: {
  orderNumber: string
  customerName: string
  items: Array<{ productName: string; quantity: number; unitPrice: number }>
  total: number
}): string {
  const rows = params.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0ece6">${i.productName}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0ece6;text-align:center">${i.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0ece6;text-align:right">${((i.unitPrice * i.quantity) / 100).toLocaleString('ru-RU')} ₽</td>
        </tr>`,
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:Georgia,serif">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
    <div style="background:#2c2c2c;padding:32px 40px">
      <h1 style="margin:0;font-size:22px;letter-spacing:2px;color:#fff;font-weight:400">ACOUSTIC SPACE</h1>
    </div>
    <div style="padding:40px">
      <h2 style="margin:0 0 8px;font-size:20px;color:#2c2c2c">Заказ оформлен</h2>
      <p style="margin:0 0 24px;color:#888;font-size:14px">№ ${params.orderNumber}</p>
      <p style="color:#444;font-size:15px">Здравствуйте, ${params.customerName}!</p>
      <p style="color:#444;font-size:15px">Ваш заказ принят в работу. Мы свяжемся с вами в ближайшее время для уточнения деталей.</p>

      <table style="width:100%;border-collapse:collapse;margin:24px 0;font-size:14px">
        <thead>
          <tr style="background:#f5f0eb">
            <th style="padding:10px 12px;text-align:left;color:#888;font-weight:500">Товар</th>
            <th style="padding:10px 12px;text-align:center;color:#888;font-weight:500">Кол.</th>
            <th style="padding:10px 12px;text-align:right;color:#888;font-weight:500">Сумма</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:12px;font-weight:600;color:#2c2c2c">Итого</td>
            <td style="padding:12px;text-align:right;font-weight:700;font-size:16px;color:#8b7355">${(params.total / 100).toLocaleString('ru-RU')} ₽</td>
          </tr>
        </tfoot>
      </table>

      <p style="color:#888;font-size:13px">С уважением,<br>Команда Acoustic Space</p>
    </div>
    <div style="background:#f5f0eb;padding:20px 40px;text-align:center">
      <p style="margin:0;font-size:12px;color:#aaa">© ${new Date().getFullYear()} Acoustic Space. Акустические панели ручной работы.</p>
    </div>
  </div>
</body>
</html>`
}

export function orderStatusHtml(params: {
  orderNumber: string
  customerName: string
  status: string
}): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:Georgia,serif">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
    <div style="background:#2c2c2c;padding:32px 40px">
      <h1 style="margin:0;font-size:22px;letter-spacing:2px;color:#fff;font-weight:400">ACOUSTIC SPACE</h1>
    </div>
    <div style="padding:40px">
      <h2 style="margin:0 0 8px;font-size:20px;color:#2c2c2c">Статус заказа обновлён</h2>
      <p style="margin:0 0 24px;color:#888;font-size:14px">№ ${params.orderNumber}</p>
      <p style="color:#444;font-size:15px">Здравствуйте, ${params.customerName}!</p>
      <p style="color:#444;font-size:15px">Статус вашего заказа изменён на: <strong>${params.status}</strong></p>
    </div>
  </div>
</body>
</html>`
}
