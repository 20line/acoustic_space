export interface CartItemConfig {
  material?: string
  color?: string
  size?: string
  finish?: string
  mounting?: string
  [key: string]: unknown
}

export interface CartItem {
  id: string
  cartId: string
  productId: string
  productName: string
  unitPrice: number // kopecks
  quantity: number
  config: CartItemConfig | null
  createdAt: string
  updatedAt: string
}

export interface CartState {
  id: string
  items: CartItem[]
  total: number  // kopecks
  count: number
}

export type OrderStatus =
  | 'NEW'
  | 'DESIGN'
  | 'APPROVAL'
  | 'PRODUCTION'
  | 'PAINTING'
  | 'PACKING'
  | 'SHIPPING'
  | 'INSTALLATION'
  | 'DONE'
  | 'CANCELLED'

export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED'
export type DeliveryType = 'PICKUP' | 'COURIER' | 'TRANSPORT'

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  config: CartItemConfig | null
}

export interface Order {
  id: string
  number: string
  userId: string | null
  customerName: string
  customerPhone: string
  customerEmail: string | null
  status: OrderStatus
  paymentStatus: PaymentStatus
  items: OrderItem[]
  subtotal: number
  discount: number
  deliveryFee: number
  total: number
  promoCode: string | null
  promoDiscount: number
  deliveryType: DeliveryType
  deliveryAddress: string | null
  invoiceNumber?: string | null
  comment: string | null
  createdAt: string
  updatedAt: string
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: 'Новый',
  DESIGN: 'Проектирование',
  APPROVAL: 'Согласование',
  PRODUCTION: 'Производство',
  PAINTING: 'Покраска',
  PACKING: 'Упаковка',
  SHIPPING: 'Отгрузка',
  INSTALLATION: 'Монтаж',
  DONE: 'Завершён',
  CANCELLED: 'Отменён',
}

export const ORDER_STATUS_STEP: Record<OrderStatus, number> = {
  NEW: 0,
  DESIGN: 1,
  APPROVAL: 2,
  PRODUCTION: 3,
  PAINTING: 4,
  PACKING: 5,
  SHIPPING: 6,
  INSTALLATION: 7,
  DONE: 8,
  CANCELLED: -1,
}
