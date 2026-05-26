import { getProducts } from "@/services/products"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export async function FeaturedProducts() {
  const products = await getProducts({ featured: true, limit: 4 })

  return (
    <section className="section" style={{ background: "var(--cream)" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p className="section-subtitle">Handpicked for you</p>
            <h2 className="section-title">Featured Pieces</h2>
            <hr className="divider" style={{ marginTop: "16px" }} />
          </div>
          <Link href="/shop" className="btn btn-outline" style={{ gap: "8px", fontSize: "11px" }}>
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {products && products.length > 0 ? (
          <div className="product-grid">
            {products.map((p) => (
              <div key={p.id}>
                {/* ProductCard imported lazily to avoid circular dep */}
                <a href={`/product/${p.slug ?? p.id}`} className="card" style={{ display: "block" }}>
                  <div style={{ aspectRatio: "3/4", overflow: "hidden", background: "var(--cream-dark)" }}>
                    <img
                      src={p.images?.[0] ?? "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600"}
                      alt={p.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                    />
                  </div>
                  <div style={{ padding: "16px" }}>
                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: "400", marginBottom: "8px" }}>{p.title}</h3>
                    <span className="price">₹{p.price.toLocaleString("en-IN")}</span>
                    {p.compare_at_price && (
                      <span className="price-compare" style={{ marginLeft: "8px" }}>₹{p.compare_at_price.toLocaleString("en-IN")}</span>
                    )}
                  </div>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px", color: "var(--muted)" }}>
            <p>Products coming soon</p>
          </div>
        )}
      </div>
    </section>
  )
}
