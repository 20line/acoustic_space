'use client'

import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { ProductCard } from '@/components/catalog/ProductCard'
import { getFeaturedProducts } from '@/data/products'

export function ProductCardsSection() {
  const products = getFeaturedProducts()

  return (
    <div className="relative z-10 py-16">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {products.map((product, i) => (
            <RevealWrapper key={product.id} delay={i * 70}>
              <ProductCard
                id={product.id}
                slug={product.slug}
                category={product.category}
                name={product.name}
                tagline={product.tagline}
                thumbnail={product.thumbnail}
                price={product.price}
                priceUnit={product.priceUnit}
              />
            </RevealWrapper>
          ))}
        </div>
      </div>
    </div>
  )
}
