export interface Product {
  id: string
  slug: string
  category: ProductCategory
  name: string
  nameEn: string
  tagline: string
  description: string
  price: number
  priceUnit: string
  images: string[]
  thumbnail: string
  specs: ProductSpec[]
  dimensions: ProductDimension[]
  colors: ProductColor[]
  materials: string[]
  finishes: string[]
  absorptionCoeff: number
  tags: string[]
  featured: boolean
  relatedIds: string[]
  usageScenarios?: string[]
  blogSlug?: string
}

export type ProductCategory =
  | 'slatted'
  | 'fabric'
  | 'artistic'
  | 'bass-traps'
  | 'diffusers'
  | 'mobile'
  | 'sets'
  | 'services'

export interface ProductSpec {
  label: string
  value: string
}

export interface ProductDimension {
  label: string
  value: string
}

export interface ProductColor {
  name: string
  hex: string
}

export interface PortfolioProject {
  id: string
  slug: string
  category: ProjectCategory
  title: string
  location: string
  area: number
  description: string
  challenge: string
  solution: string
  result: string
  images: string[]
  thumbnail: string
  panelsUsed: string[]
  year: number
  tags: string[]
}

export type ProjectCategory =
  | 'home-theater'
  | 'studio'
  | 'office'
  | 'restaurant'
  | 'hifi'
  | 'rehearsal'

export interface Review {
  id: string
  author: string
  role: string
  company?: string
  text: string
  videoUrl?: string
  videoThumb?: string
  avatar?: string
  rating: number
  projectId?: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  category: string
}

export interface Segment {
  id: string
  slug: string
  title: string
  description: string
  image: string
  bgClass: string
  href: string
}

export interface NavItem {
  label: string
  labelEn: string
  href: string
  children?: NavItem[]
}

export interface ContactFormData {
  name: string
  phone: string
  telegram?: string
  email: string
  roomType: string
  comment?: string
  files?: FileList
}

export interface ConfiguratorState {
  color: string
  material: string
  width: number
  height: number
  thickness: number
  lighting: boolean
  area: number
  quantity: number
}

export interface CalculatorState {
  roomType: string
  area: number
  ceilingHeight: number
  panelType: string
  wallsCount: number
}

export interface CalculatorResult {
  minCost: number
  maxCost: number
  panelsArea: number
  recommendation: string
}

export interface SegmentFeature {
  icon: string
  title: string
  description: string
}

export interface SegmentPageData {
  slug: string
  title: string
  tagline: string
  description: string
  heroImage: string
  features: SegmentFeature[]
  recommendations: string
  recommendedCategories: string[]
  ctaText: string
}
