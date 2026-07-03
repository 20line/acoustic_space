import { prisma } from './prisma'

// Generates sequential order numbers: AS-2024-001, AS-2024-002, ...
export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `AS-${year}-`

  const last = await prisma.order.findFirst({
    where: { number: { startsWith: prefix } },
    orderBy: { createdAt: 'desc' },
    select: { number: true },
  })

  const seq = last ? parseInt(last.number.split('-')[2], 10) + 1 : 1
  return `${prefix}${String(seq).padStart(3, '0')}`
}
