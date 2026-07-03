export type DeliveryType = 'PICKUP' | 'COURIER' | 'TRANSPORT'

// Delivery fees in kopecks. Configurable via env vars.
export const DELIVERY_RATES: Record<DeliveryType, number> = {
  PICKUP: 0,
  COURIER: Number(process.env.DELIVERY_COURIER_FEE ?? 300000),
  TRANSPORT: Number(process.env.DELIVERY_TRANSPORT_FEE ?? 0),
}

export function calcDeliveryFee(type: DeliveryType): number {
  return DELIVERY_RATES[type] ?? 0
}
