import { ProductCard } from "./ProductCard"
import { Product } from "@/types/database"

interface Props {
  products: Product[]
  title?: string
  subtitle?: string
}

export function ProductGrid({ products, title, subtitle }: Props) {
  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--muted)" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "20px" }}>No products found</p>
        <p style={{ fontSize: "14px", marginTop: "8px" }}>Check back soon for new arrivals.</p>
      </div>
    )
  }

  return (
    <section className="section">
      <div className="container">
        {(title || subtitle) && (
          <div style={{ marginBottom: "40px" }}>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
            {title && <h2 className="section-title">{title}</h2>}
            <hr className="divider" style={{ marginTop: "16px" }} />
          </div>
        )}
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
