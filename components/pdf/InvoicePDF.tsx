import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InvoiceData {
  invoiceNumber: string
  orderNumber: string
  date: string // ISO
  seller: {
    name: string
    inn: string
    kpp: string
    address: string
    bank: string
    bik: string
    account: string
    corrAccount: string
  }
  buyer: {
    name: string
    inn: string
    kpp?: string
    address: string
  }
  items: Array<{
    name: string
    qty: number
    unit: string
    price: number // kopecks
  }>
  vatRate: number | null // null = без НДС
}

// ─── Fonts (built-in PDF fonts support only latin — use built-in for now) ─────
// For Cyrillic support in production register a TTF font via Font.register()
// Example: Font.register({ family: 'Roboto', src: '/fonts/Roboto-Regular.ttf' })

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 8, padding: 28, color: '#1a1a1a' },
  // Header
  headerRow: { flexDirection: 'row', marginBottom: 14 },
  bankBox: { flex: 1, border: '1pt solid #999', padding: 6, marginRight: 6, fontSize: 7 },
  bankLabel: { color: '#666', marginBottom: 2 },
  bankVal: { fontFamily: 'Helvetica-Bold', fontSize: 8 },
  logoBox: { width: 160, border: '1pt solid #999', padding: 6, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontFamily: 'Helvetica-Bold', fontSize: 11, letterSpacing: 1, textAlign: 'center' },
  logoSub: { fontSize: 7, color: '#666', textAlign: 'center', marginTop: 2 },
  // Title
  titleRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 10 },
  title: { fontFamily: 'Helvetica-Bold', fontSize: 14, marginRight: 8 },
  titleSub: { fontSize: 8, color: '#444' },
  // Parties
  partyBlock: { marginBottom: 8 },
  partyRow: { flexDirection: 'row', marginBottom: 3 },
  partyLabel: { width: 80, color: '#666', fontSize: 7.5 },
  partyVal: { flex: 1, fontFamily: 'Helvetica-Bold', fontSize: 7.5 },
  // Table
  table: { marginTop: 10, marginBottom: 10 },
  tableHead: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderTop: '1pt solid #ccc', borderBottom: '1pt solid #ccc', paddingVertical: 4 },
  tableRow: { flexDirection: 'row', borderBottom: '0.5pt solid #e0e0e0', paddingVertical: 3 },
  cellNum: { width: 22, paddingHorizontal: 4, textAlign: 'center' },
  cellName: { flex: 1, paddingHorizontal: 4 },
  cellUnit: { width: 36, paddingHorizontal: 4, textAlign: 'center' },
  cellQty: { width: 36, paddingHorizontal: 4, textAlign: 'center' },
  cellPrice: { width: 64, paddingHorizontal: 4, textAlign: 'right' },
  cellAmount: { width: 72, paddingHorizontal: 4, textAlign: 'right' },
  headText: { fontFamily: 'Helvetica-Bold', fontSize: 7 },
  // Totals
  totalsBlock: { alignItems: 'flex-end', marginBottom: 12 },
  totalRow: { flexDirection: 'row', marginBottom: 2 },
  totalLabel: { width: 100, textAlign: 'right', paddingRight: 8, color: '#666', fontSize: 7.5 },
  totalVal: { width: 80, textAlign: 'right', fontFamily: 'Helvetica-Bold', fontSize: 7.5 },
  grandTotal: { fontFamily: 'Helvetica-Bold', fontSize: 9, borderTop: '1pt solid #ccc', paddingTop: 3 },
  // Footer
  footerText: { fontSize: 7, color: '#666', marginTop: 6, textAlign: 'center' },
  sigBlock: { flexDirection: 'row', marginTop: 28, justifyContent: 'space-between' },
  sigLine: { borderBottom: '0.5pt solid #999', width: 160, paddingBottom: 2 },
  sigLabel: { fontSize: 7, color: '#666', marginTop: 3 },
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rub(kopecks: number) {
  return (kopecks / 100).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InvoicePDF({ data }: { data: InvoiceData }) {
  const subtotal = data.items.reduce((s, i) => s + i.price * i.qty, 0)
  const vatAmount = data.vatRate !== null ? Math.round(subtotal * data.vatRate) : 0
  const total = subtotal + vatAmount

  return (
    <Document title={`Счёт ${data.invoiceNumber}`} author="ACOUSTIC SPACE">
      <Page size="A4" style={s.page}>

        {/* Top: bank details + logo */}
        <View style={s.headerRow}>
          <View style={s.bankBox}>
            <Text style={s.bankLabel}>Банк получателя:</Text>
            <Text style={s.bankVal}>{data.seller.bank}</Text>
            <Text style={{ marginTop: 4 }}>
              <Text style={s.bankLabel}>БИК: </Text>
              <Text style={s.bankVal}>{data.seller.bik}</Text>
            </Text>
            <Text style={{ marginTop: 2 }}>
              <Text style={s.bankLabel}>Сч. №: </Text>
              <Text style={s.bankVal}>{data.seller.account}</Text>
            </Text>
            <Text style={{ marginTop: 2 }}>
              <Text style={s.bankLabel}>Корр. сч.: </Text>
              <Text style={s.bankVal}>{data.seller.corrAccount}</Text>
            </Text>
          </View>
          <View style={s.logoBox}>
            <Text style={s.logoText}>ACOUSTIC SPACE</Text>
            <Text style={s.logoSub}>Акустические панели</Text>
          </View>
        </View>

        {/* Invoice title */}
        <View style={s.titleRow}>
          <Text style={s.title}>Счёт на оплату № {data.invoiceNumber}</Text>
          <Text style={s.titleSub}>от {formatDate(data.date)}</Text>
        </View>

        {/* Seller */}
        <View style={s.partyBlock}>
          <View style={s.partyRow}>
            <Text style={s.partyLabel}>Поставщик:</Text>
            <Text style={s.partyVal}>{data.seller.name}</Text>
          </View>
          <View style={s.partyRow}>
            <Text style={s.partyLabel}>ИНН / КПП:</Text>
            <Text style={s.partyVal}>{data.seller.inn} / {data.seller.kpp}</Text>
          </View>
          <View style={s.partyRow}>
            <Text style={s.partyLabel}>Адрес:</Text>
            <Text style={s.partyVal}>{data.seller.address}</Text>
          </View>
        </View>

        {/* Buyer */}
        <View style={[s.partyBlock, { borderTop: '0.5pt solid #ccc', paddingTop: 6 }]}>
          <View style={s.partyRow}>
            <Text style={s.partyLabel}>Покупатель:</Text>
            <Text style={s.partyVal}>{data.buyer.name}</Text>
          </View>
          <View style={s.partyRow}>
            <Text style={s.partyLabel}>ИНН{data.buyer.kpp ? ' / КПП' : ''}:</Text>
            <Text style={s.partyVal}>{data.buyer.inn}{data.buyer.kpp ? ` / ${data.buyer.kpp}` : ''}</Text>
          </View>
          <View style={s.partyRow}>
            <Text style={s.partyLabel}>Адрес:</Text>
            <Text style={s.partyVal}>{data.buyer.address}</Text>
          </View>
        </View>

        {/* Items table */}
        <View style={s.table}>
          {/* Head */}
          <View style={s.tableHead}>
            <Text style={[s.cellNum, s.headText]}>№</Text>
            <Text style={[s.cellName, s.headText]}>Наименование</Text>
            <Text style={[s.cellUnit, s.headText]}>Ед.</Text>
            <Text style={[s.cellQty, s.headText]}>Кол.</Text>
            <Text style={[s.cellPrice, s.headText]}>Цена, ₽</Text>
            <Text style={[s.cellAmount, s.headText]}>Сумма, ₽</Text>
          </View>
          {/* Rows */}
          {data.items.map((item, i) => (
            <View key={i} style={s.tableRow}>
              <Text style={s.cellNum}>{i + 1}</Text>
              <Text style={s.cellName}>{item.name}</Text>
              <Text style={s.cellUnit}>{item.unit}</Text>
              <Text style={s.cellQty}>{item.qty}</Text>
              <Text style={s.cellPrice}>{rub(item.price)}</Text>
              <Text style={s.cellAmount}>{rub(item.price * item.qty)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={s.totalsBlock}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Итого без НДС:</Text>
            <Text style={s.totalVal}>{rub(subtotal)}</Text>
          </View>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>
              {data.vatRate !== null ? `НДС ${Math.round(data.vatRate * 100)}%:` : 'НДС:'}
            </Text>
            <Text style={s.totalVal}>
              {data.vatRate !== null ? rub(vatAmount) : 'Без НДС'}
            </Text>
          </View>
          <View style={[s.totalRow, s.grandTotal]}>
            <Text style={s.totalLabel}>ИТОГО к оплате:</Text>
            <Text style={s.totalVal}>{rub(total)} руб.</Text>
          </View>
        </View>

        <Text style={s.footerText}>
          Оплата данного счёта означает согласие с условиями поставки.
          Счёт действителен в течение 5 банковских дней.
        </Text>

        {/* Signatures */}
        <View style={s.sigBlock}>
          <View>
            <View style={s.sigLine} />
            <Text style={s.sigLabel}>Руководитель</Text>
          </View>
          <View>
            <View style={s.sigLine} />
            <Text style={s.sigLabel}>Главный бухгалтер</Text>
          </View>
        </View>

      </Page>
    </Document>
  )
}
