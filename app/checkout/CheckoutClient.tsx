'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ArrowLeft, FileText } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProgressBar } from '@/components/ui/ProgressBar'

type DeliveryType = 'PICKUP' | 'COURIER' | 'TRANSPORT'

interface FormData {
  customerName: string
  customerPhone: string
  customerEmail: string
  deliveryType: DeliveryType
  deliveryAddress: string
  comment: string
  // Legal entity (optional, for invoice requests)
  wantsInvoice: boolean
  legalName: string
  legalInn: string
  legalKpp: string
  legalAddress: string
}

interface PromoState {
  code: string
  input: string
  percent: number
  discount: number
  error: string
  loading: boolean
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (!digits) return ''
  let result = '+7'
  if (digits.length > 1) result += ' (' + digits.slice(1, 4)
  if (digits.length > 4) result += ') ' + digits.slice(4, 7)
  if (digits.length > 7) result += '-' + digits.slice(7, 9)
  if (digits.length > 9) result += '-' + digits.slice(9, 11)
  return result
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--muted)' }}>{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full border rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 transition-colors'
const inputStyle = { borderColor: 'var(--line)' }

export default function CheckoutClient() {
  const { cart, clearCart } = useCart()
  const [form, setForm] = useState<FormData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryType: 'PICKUP',
    deliveryAddress: '',
    comment: '',
    wantsInvoice: false,
    legalName: '',
    legalInn: '',
    legalKpp: '',
    legalAddress: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [promo, setPromo] = useState<PromoState>({
    code: '', input: '', percent: 0, discount: 0, error: '', loading: false,
  })

  const items = cart?.items ?? []
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
  const finalSubtotal = subtotal - promo.discount

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function applyPromo() {
    if (!promo.input.trim()) return
    setPromo((p) => ({ ...p, loading: true, error: '' }))
    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promo.input.trim(), subtotal }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPromo((p) => ({ ...p, loading: false, error: data.error ?? 'Промокод недействителен', code: '', discount: 0 }))
      } else {
        setPromo((p) => ({ ...p, loading: false, error: '', code: data.code, percent: data.percent, discount: data.discount }))
      }
    } catch {
      setPromo((p) => ({ ...p, loading: false, error: 'Ошибка проверки промокода' }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.deliveryType !== 'PICKUP' && !form.deliveryAddress) {
      setError('Укажите адрес доставки')
      return
    }

    if (form.wantsInvoice && (!form.legalName || !form.legalInn)) {
      setError('Для выставления счёта укажите название организации и ИНН')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerEmail: form.customerEmail || undefined,
          deliveryType: form.deliveryType,
          deliveryAddress: form.deliveryAddress || undefined,
          comment: form.comment || undefined,
          paymentMethod: form.wantsInvoice ? 'INVOICE' : 'CARD',
          legalName: form.wantsInvoice ? form.legalName : undefined,
          legalInn: form.wantsInvoice ? form.legalInn : undefined,
          legalKpp: form.wantsInvoice ? (form.legalKpp || undefined) : undefined,
          legalAddress: form.wantsInvoice ? (form.legalAddress || undefined) : undefined,
          promoCode: promo.code || undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Ошибка при отправке заявки')
      }

      const order = await res.json()
      setOrderId(order.number ?? order.id)

      // Cart is cleared only after the request is confirmed
      clearCart()
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  // Empty cart state
  if (items.length === 0 && !success) {
    return (
      <>
        <ProgressBar />
        <Header />
        <main className="min-h-screen pt-24" style={{ background: 'var(--cream-2)' }}>
          <div className="wrap py-20 text-center">
            <FileText size={48} className="mx-auto mb-4" style={{ color: 'var(--taupe)' }} aria-hidden />
            <h1 className="text-[28px] font-semibold mb-3" style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}>
              Ваша заявка пуста
            </h1>
            <p className="text-[15px] mb-8" style={{ color: 'var(--muted)' }}>
              Добавьте изделия из каталога, чтобы оформить заявку на расчёт
            </p>
            <Link href="/catalog" className="btn btn-dark">
              Перейти в каталог
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Success state
  if (success) {
    return (
      <>
        <ProgressBar />
        <Header />
        <main className="min-h-screen pt-24" style={{ background: 'var(--cream-2)' }}>
          <div className="wrap py-20 max-w-lg mx-auto text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'var(--sand)' }}
            >
              <Check size={28} style={{ color: 'var(--accent)' }} aria-hidden />
            </div>
            <h1
              className="text-[clamp(28px,4vw,40px)] font-semibold mb-4"
              style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
            >
              Заявка принята!
            </h1>
            <p className="text-[15px] leading-relaxed mb-2" style={{ color: 'var(--muted)' }}>
              Спасибо! Мы получили вашу заявку{orderId ? ` № ${orderId}` : ''}.
            </p>
            <p className="text-[15px] leading-relaxed mb-8" style={{ color: 'var(--muted)' }}>
              Наш специалист свяжется с вами в ближайшее время для уточнения деталей проекта,
              согласования стоимости и дальнейшего оформления заказа.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="btn btn-dark">
                На главную
              </Link>
              <Link href="/catalog" className="btn btn-out">
                Продолжить подбор
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <ProgressBar />
      <Header />
      <main className="min-h-screen pt-24" style={{ background: 'var(--cream-2)' }}>
        <div className="wrap py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[13px] mb-8" style={{ color: 'var(--muted)' }} aria-label="Хлебные крошки">
            <Link href="/" className="hover:text-accent">Главная</Link>
            <span aria-hidden>/</span>
            <span style={{ color: 'var(--ink)' }}>Оформление заявки</span>
          </nav>

          <h1
            className="text-[clamp(28px,4vw,44px)] font-semibold mb-10"
            style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--ink)' }}
          >
            Оформление заявки
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8" noValidate>
            {/* Left: form fields */}
            <div className="lg:col-span-3 space-y-6">

              {/* Contact */}
              <section className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
                <h2 className="text-[17px] font-medium mb-5" style={{ color: 'var(--ink)' }}>Контактные данные</h2>
                <div className="space-y-4">
                  <Field label="Имя *">
                    <input
                      required
                      value={form.customerName}
                      onChange={(e) => set('customerName', e.target.value)}
                      className={inputCls}
                      style={inputStyle}
                      placeholder="Иван Иванов"
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="Телефон *">
                    <input
                      required
                      type="tel"
                      value={form.customerPhone}
                      onChange={(e) => set('customerPhone', formatPhone(e.target.value))}
                      className={inputCls}
                      style={inputStyle}
                      placeholder="+7 (999) 000-00-00"
                      autoComplete="tel"
                      maxLength={18}
                    />
                  </Field>
                  <Field label="Email (необязательно)">
                    <input
                      type="email"
                      value={form.customerEmail}
                      onChange={(e) => set('customerEmail', e.target.value)}
                      className={inputCls}
                      style={inputStyle}
                      placeholder="email@example.com"
                      autoComplete="email"
                    />
                  </Field>
                </div>
              </section>

              {/* Delivery */}
              <section className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
                <h2 className="text-[17px] font-medium mb-5" style={{ color: 'var(--ink)' }}>Доставка</h2>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {([
                    ['PICKUP', 'Самовывоз'],
                    ['COURIER', 'Курьер'],
                    ['TRANSPORT', 'Транспортная компания'],
                  ] as [DeliveryType, string][]).map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => set('deliveryType', val)}
                      className="py-2.5 px-3 text-xs rounded-lg border transition-colors"
                      style={{
                        borderColor: form.deliveryType === val ? 'var(--accent)' : 'var(--line)',
                        background: form.deliveryType === val ? 'var(--accent)' : 'transparent',
                        color: form.deliveryType === val ? 'white' : 'var(--muted)',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {form.deliveryType !== 'PICKUP' && (
                  <Field label="Адрес доставки *">
                    <input
                      required
                      value={form.deliveryAddress}
                      onChange={(e) => set('deliveryAddress', e.target.value)}
                      className={inputCls}
                      style={inputStyle}
                      placeholder="г. Москва, ул. Примерная, д. 1"
                      autoComplete="street-address"
                    />
                  </Field>
                )}
                <p className="text-[12px] mt-3" style={{ color: 'var(--muted)' }}>
                  Точные условия и стоимость доставки согласовываются с менеджером.
                </p>
              </section>

              {/* Comment */}
              <section className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
                <h2 className="text-[17px] font-medium mb-5" style={{ color: 'var(--ink)' }}>Комментарий к заявке</h2>
                <textarea
                  value={form.comment}
                  onChange={(e) => set('comment', e.target.value)}
                  rows={4}
                  className={inputCls + ' resize-none'}
                  style={inputStyle}
                  placeholder="Площадь помещения, требования к материалам, сроки, особые пожелания..."
                />
              </section>

              {/* Legal entity (optional) */}
              <section className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
                <label className="flex items-center gap-3 cursor-pointer mb-1">
                  <input
                    type="checkbox"
                    checked={form.wantsInvoice}
                    onChange={(e) => set('wantsInvoice', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-[14px] font-medium" style={{ color: 'var(--ink)' }}>
                    Нужен счёт на юридическое лицо
                  </span>
                </label>
                <p className="text-[12px] mb-4 ml-7" style={{ color: 'var(--muted)' }}>
                  Сформируем счёт в формате PDF для оплаты по реквизитам
                </p>
                {form.wantsInvoice && (
                  <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
                    <Field label="Название организации *">
                      <input
                        value={form.legalName}
                        onChange={(e) => set('legalName', e.target.value)}
                        className={inputCls}
                        style={inputStyle}
                        placeholder="ООО «Компания»"
                        autoComplete="organization"
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="ИНН *">
                        <input
                          value={form.legalInn}
                          onChange={(e) => set('legalInn', e.target.value)}
                          className={inputCls}
                          style={inputStyle}
                          placeholder="0000000000"
                          maxLength={12}
                          inputMode="numeric"
                        />
                      </Field>
                      <Field label="КПП">
                        <input
                          value={form.legalKpp}
                          onChange={(e) => set('legalKpp', e.target.value)}
                          className={inputCls}
                          style={inputStyle}
                          placeholder="000000000"
                          maxLength={9}
                          inputMode="numeric"
                        />
                      </Field>
                    </div>
                    <Field label="Юридический адрес">
                      <input
                        value={form.legalAddress}
                        onChange={(e) => set('legalAddress', e.target.value)}
                        className={inputCls}
                        style={inputStyle}
                        placeholder="г. Москва, ул. Примерная, д. 1"
                      />
                    </Field>
                  </div>
                )}
              </section>
              {/* Promo code */}
              <section className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
                <h2 className="text-[17px] font-medium mb-4" style={{ color: 'var(--ink)' }}>Промокод</h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promo.input}
                    onChange={(e) => setPromo((p) => ({ ...p, input: e.target.value.toUpperCase(), code: '', discount: 0, error: '' }))}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyPromo() } }}
                    className={inputCls}
                    style={inputStyle}
                    placeholder="PROMO2024"
                    maxLength={30}
                    disabled={!!promo.code}
                  />
                  {promo.code ? (
                    <button
                      type="button"
                      onClick={() => setPromo({ code: '', input: '', percent: 0, discount: 0, error: '', loading: false })}
                      className="px-4 py-2 text-[13px] rounded-lg border transition-colors hover:border-red-400 hover:text-red-500 whitespace-nowrap"
                      style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
                    >
                      Убрать
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={applyPromo}
                      disabled={promo.loading || !promo.input.trim()}
                      className="px-4 py-2 text-[13px] font-medium rounded-lg transition-opacity disabled:opacity-50 whitespace-nowrap"
                      style={{ background: 'var(--accent)', color: 'white' }}
                    >
                      {promo.loading ? '...' : 'Применить'}
                    </button>
                  )}
                </div>
                {promo.error && (
                  <p className="mt-2 text-[12px]" style={{ color: '#B91C1C' }}>{promo.error}</p>
                )}
                {promo.code && (
                  <p className="mt-2 text-[12px]" style={{ color: '#166534' }}>
                    Промокод {promo.code} применён — скидка {promo.percent}%
                  </p>
                )}
              </section>
            </div>

            {/* Right: summary */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl p-6 sticky top-6" style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
                <h2 className="text-[17px] font-medium mb-5" style={{ color: 'var(--ink)' }}>Ваша заявка</h2>

                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-[13px]">
                      <span className="flex-1 pr-2" style={{ color: 'var(--muted)' }}>
                        {item.productName} × {item.quantity}
                      </span>
                      <span className="font-medium whitespace-nowrap" style={{ color: 'var(--ink)' }}>
                        {((item.unitPrice * item.quantity) / 100).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-6 space-y-2" style={{ borderColor: 'var(--line)' }}>
                  <div className="flex justify-between text-[13px]">
                    <span style={{ color: 'var(--muted)' }}>Предварительно</span>
                    <span style={{ color: 'var(--ink)' }}>
                      {(subtotal / 100).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  {promo.discount > 0 && (
                    <div className="flex justify-between text-[13px]">
                      <span style={{ color: '#166534' }}>Скидка {promo.percent}%</span>
                      <span style={{ color: '#166534' }}>−{(promo.discount / 100).toLocaleString('ru-RU')} ₽</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[14px] font-semibold pt-1 border-t" style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}>
                    <span>Итого от</span>
                    <span>{(finalSubtotal / 100).toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <p className="text-[11px]" style={{ color: 'var(--taupe)' }}>
                    Окончательная стоимость согласовывается с менеджером с учётом объёма,
                    параметров помещения и условий доставки.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 rounded-lg px-4 py-3 text-[13px]" style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-[6px] py-3.5 text-[14px] font-semibold text-white transition-opacity disabled:opacity-60"
                  style={{ background: 'var(--accent)' }}
                >
                  {loading ? 'Отправляем заявку...' : 'Отправить заявку'}
                </button>

                <p className="text-[11px] text-center mt-3" style={{ color: 'var(--taupe)' }}>
                  Нажимая кнопку, вы соглашаетесь с{' '}
                  <Link href="/privacy" className="underline hover:text-accent">политикой конфиденциальности</Link>
                </p>

                <Link
                  href="/catalog"
                  className="mt-4 flex items-center justify-center gap-1 text-[13px] transition-colors hover:text-accent"
                  style={{ color: 'var(--muted)' }}
                >
                  <ArrowLeft size={13} aria-hidden />
                  Вернуться в каталог
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
