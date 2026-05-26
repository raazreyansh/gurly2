import { getProducts, getCategories } from "@/services/products"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { SlidersHorizontal } from "lucide-react"
import Link from "next/link"

interface SearchParams {
  category?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
}

export const metadata = {
  title: "Shop",
  description: "Browse all premium earrings, necklaces, bracelets and accessories from GURLY.",
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined
  const [products, categories] = await Promise.all([
    getProducts({
      categorySlug: params.category,
      minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    }),
    getCategories(),
  ])

  function priceHref(priceParams: { minPrice?: number; maxPrice?: number }) {
    const nextParams = new URLSearchParams()
    if (params.category) nextParams.set("category", params.category)
    if (typeof priceParams.minPrice === "number") nextParams.set("minPrice", String(priceParams.minPrice))
    if (typeof priceParams.maxPrice === "number") nextParams.set("maxPrice", String(priceParams.maxPrice))
    return `/shop?${nextParams.toString()}`
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <div style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "40px 0" }}>
          <div className="container">
            <p style={{ fontSize: "12px", color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
              {(products?.length ?? 0)} items
            </p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "36px", fontWeight: "500" }}>
              {params.category ? params.category.charAt(0).toUpperCase() + params.category.slice(1) : "All Products"}
            </h1>
          </div>
        </div>

        <div className="container" style={{ paddingTop: "32px", paddingBottom: "80px" }}>
          <div style={{ display: "flex", gap: "40px" }}>
            {/* Sidebar Filters */}
            <aside style={{ width: "220px", flexShrink: 0 }} className="hidden md:block">
              <div style={{ position: "sticky", top: "calc(var(--nav-h) + 24px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                  <SlidersHorizontal size={15} color="var(--charcoal)" />
                  <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase" }}>Filters</span>
                </div>

                {/* Categories Filter */}
                <div style={{ marginBottom: "32px" }}>
                  <h3 style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>Category</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Link
                      href="/shop"
                      style={{
                        fontSize: "13px",
                        color: !params.category ? "var(--rose)" : "var(--charcoal-light)",
                        fontWeight: !params.category ? "600" : "400",
                        transition: "color 0.2s",
                      }}
                    >
                      All ({products?.length ?? 0})
                    </Link>
                    {categories?.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${cat.slug}`}
                        style={{
                          fontSize: "13px",
                          color: params.category === cat.slug ? "var(--rose)" : "var(--charcoal-light)",
                          fontWeight: params.category === cat.slug ? "600" : "400",
                          transition: "color 0.2s",
                        }}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h3 style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>Price Range</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { label: "Under ₹500", maxPrice: 500 },
                      { label: "₹500 – ₹1,000", minPrice: 500, maxPrice: 1000 },
                      { label: "₹1,000 – ₹2,000", minPrice: 1000, maxPrice: 2000 },
                      { label: "Above ₹2,000", minPrice: 2000 },
                    ].map(({ label, minPrice: min, maxPrice: max }) => (
                      <Link
                        key={label}
                        href={priceHref({ minPrice: min, maxPrice: max })}
                        style={{ textAlign: "left", fontSize: "13px", color: "var(--charcoal-light)" }}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Products */}
            <div style={{ flex: 1 }}>
              {products && products.length > 0 ? (
                <div className="product-grid">
                  {products.map((p) => (
                    <a key={p.id} href={`/product/${p.slug ?? p.id}`} className="card" style={{ display: "block" }}>
                      <div style={{ aspectRatio: "3/4", overflow: "hidden", background: "var(--cream-dark)" }}>
                        <img
                          src={p.images?.[0] ?? "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600"}
                          alt={p.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                          className="hover-scale"
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
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "80px", color: "var(--muted)" }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "8px" }}>No products found</p>
                  <p style={{ fontSize: "13px" }}>Try a different category or check back soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
