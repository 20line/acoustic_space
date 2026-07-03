import { prisma } from './prisma'

// Generates sequential invoice numbers: СЧ-2024-001
export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `СЧ-${year}-`

  const last = await prisma.order.findFirst({
    where: { invoiceNumber: { startsWith: prefix } },
    orderBy: { createdAt: 'desc' },
    select: { invoiceNumber: true },
  })

  const seq = last?.invoiceNumber
    ? parseInt(last.invoiceNumber.split('-')[2], 10) + 1
    : 1

  return `${prefix}${String(seq).padStart(3, '0')}`
}
