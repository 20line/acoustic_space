const SMSC_API = 'https://smsc.ru/sys/send.php'

interface SmscResponse {
  id?: number
  cnt?: number
  cost?: string
  balance?: string
  error?: string
  error_code?: number
}

export async function sendSms(phone: string, message: string): Promise<void> {
  const login = process.env.SMSC_LOGIN
  const password = process.env.SMSC_PASSWORD

  if (!login || !password) {
    // Dev mode — just log the code
    console.log(`[SMS DEV] → ${phone}: ${message}`)
    return
  }

  const normalized = phone.replace(/\D/g, '')

  const body = new URLSearchParams({
    login,
    psw: password,
    phones: normalized,
    mes: message,
    fmt: '3',
    charset: 'utf-8',
  })

  const res = await fetch(SMSC_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    cache: 'no-store',
  })
  const data: SmscResponse = await res.json()

  if (data.error) {
    throw new Error(`SMSC error ${data.error_code}: ${data.error}`)
  }
}

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}
