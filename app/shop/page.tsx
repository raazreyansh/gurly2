import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ProductCard } from "@/components/product/ProductCard"
import { getCategories, getProducts } from "@/services/products"

interface SearchParams {
  category?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
}

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Shop",
  description: "Browse all GURLY accessories — earrings, necklaces, bracelets and gift sets.",
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

  const allCategories = [
    { id: "all", name: "All", slug: undefined },
    ...(categories ?? []),
  ]

  const priceRanges = [
    { label: "Under ₹500", maxPrice: 500 },
    { label: "₹500 - 1K", minPrice: 500, maxPrice: 1000 },
    { label: "₹1K - 2K", minPrice: 1000, maxPrice: 2000 },
    { label: "₹2K+", minPrice: 2000 },
  ]

  function priceHref(min?: number, max?: number) {
    const search = new URLSearchParams()
    if (params.category) search.set("category", params.category)
    if (min) search.set("minPrice", String(min))
    if (max) search.set("maxPrice", String(max))
    return `/shop?${search.toString()}`
  }

  const hasFilters = params.category || params.minPrice || params.maxPrice

  return (
    <div className="storefront-shell min-h-screen text-black">
      <Navbar />

      <main className="pt-16">
        <section className="store-section pt-6">
          <div className="shop-hero">
            <div>
              <p className="store-label">Girls accessories</p>
              <h1>Shop All Accessories</h1>
              <p>Discover premium pieces curated to elevate your everyday sparkle.</p>
            </div>
            <img src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1200" alt="Luxury accessories" />
          </div>
        </section>

        <section className="shop-grid-shell">
          <aside className="shop-filters">
            <div className="section-heading-row">
              <div>
                <p className="store-label">Filters</p>
                <h2>Refine</h2>
              </div>
            </div>

            <div className="filter-group">
              <h3>Category</h3>
              {allCategories.map((category) => {
                const isActive = category.slug ? params.category === category.slug : !params.category
                const href = category.slug ? `/shop?category=${category.slug}` : "/shop"
                return (
                  <Link key={category.id} href={href} className={isActive ? "filter-chip active" : "filter-chip"}>
                    {category.name}
                  </Link>
                )
              })}
            </div>

            <div className="filter-group">
              <h3>Price</h3>
              {priceRanges.map((range) => {
                const isActive = params.minPrice === String(range.minPrice ?? "") && params.maxPrice === String(range.maxPrice ?? "")
                return (
                  <Link key={range.label} href={priceHref(range.minPrice, range.maxPrice)} className={isActive ? "filter-chip active" : "filter-chip"}>
                    {range.label}
                  </Link>
                )
              })}
              {hasFilters && (
                <Link href="/shop" className="filter-chip subtle">
                  Clear filters
                </Link>
              )}
            </div>
          </aside>

          <div className="shop-results">
            <div className="shop-results-bar">
              <p>{products.length} items</p>
              <div className="shop-sort-pill">Sort by: Popularity</div>
            </div>

            {products.length > 0 ? (
              <div className="bestseller-carousel">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="empty-shop-state">
                <p>No products found</p>
                <Link href="/shop" className="store-button store-button-dark">View All</Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
