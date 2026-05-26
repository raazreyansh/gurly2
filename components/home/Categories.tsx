import Link from "next/link"
import { ArrowRight } from "lucide-react"

const CATEGORIES = [
  { name: "Earrings", slug: "earrings", image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500", count: "120+ styles" },
  { name: "Necklaces", slug: "necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500", count: "85+ styles" },
  { name: "Rings", slug: "rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500", count: "60+ styles" },
  { name: "Bracelets", slug: "bracelets", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500", count: "45+ styles" },
]

export function Categories() {
  return (
    <section className="section" style={{ background: "var(--white)" }}>
      <div className="container">
        <div style={{ marginBottom: "40px" }}>
          <p className="section-subtitle">Explore by Category</p>
          <h2 className="section-title">Find Your Style</h2>
          <hr className="divider" style={{ marginTop: "16px" }} />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
        }}
          className="md:grid-cols-4"
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              id={`category-${cat.slug}`}
              style={{
                position: "relative",
                borderRadius: "4px",
                overflow: "hidden",
                aspectRatio: "3/4",
                display: "block",
              }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.6s ease",
                }}
                className="hover-scale"
              />
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(26,26,26,0.72) 0%, transparent 50%)",
              }} />
              <div style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
                color: "var(--white)",
              }}>
                <p style={{ fontSize: "11px", opacity: 0.7, letterSpacing: "0.06em", marginBottom: "4px" }}>{cat.count}</p>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: "500" }}>{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link href="/shop" className="btn btn-outline" style={{ gap: "10px" }}>
            View All Categories <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
