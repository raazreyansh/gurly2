import { getProducts, getCategories } from "@/services/products"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { SlidersHorizontal, Sparkles } from "lucide-react"
import Link from "next/link"
import { ProductCard } from "@/components/product/ProductCard"

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

  const categoryName = params.category
    ? categories?.find((c) => c.slug === params.category)?.name ?? params.category
    : "All Accessories"

  return (
    <div className="storefront-shell flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Luxury Header */}
        <div className="py-12 bg-gradient-to-b from-sky-light/30 to-transparent border-b border-white/40">
          <div className="container">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={11} className="text-rose" fill="currentColor" />
              <p className="store-label mb-0">Premium Discovery</p>
            </div>
            <h1 className="font-serif text-4xl font-medium text-charcoal">
              {categoryName}
            </h1>
            <p className="text-muted text-xs mt-2">
              Showing {(products?.length ?? 0)} premium piece{(products?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="container py-12 px-4">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Immersive Glass Sidebar Filters */}
            <aside className="w-full md:w-[240px] flex-shrink-0">
              <div className="sticky-buy-panel p-6 bg-white/60 border border-white/70 rounded-3xl sticky top-[118px] space-y-8">
                
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100/50">
                  <SlidersHorizontal size={14} className="text-charcoal" />
                  <span className="text-xs font-bold tracking-wider uppercase text-charcoal">Filters</span>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-[10px] font-extrabold tracking-widest uppercase text-muted mb-4">Category</h3>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/shop"
                      className={`text-sm py-1.5 px-3 rounded-xl transition-all duration-200 ${
                        !params.category
                          ? "bg-rose-light/10 text-rose font-bold"
                          : "text-charcoal-light hover:text-charcoal hover:bg-slate-100/50"
                      }`}
                    >
                      All Pieces
                    </Link>
                    {categories?.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${cat.slug}`}
                        className={`text-sm py-1.5 px-3 rounded-xl transition-all duration-200 ${
                          params.category === cat.slug
                            ? "bg-rose-light/10 text-rose font-bold"
                            : "text-charcoal-light hover:text-charcoal hover:bg-slate-100/50"
                        }`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Price Ranges */}
                <div>
                  <h3 className="text-[10px] font-extrabold tracking-widest uppercase text-muted mb-4">Price Range</h3>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: "Under ₹500", maxPrice: 500 },
                      { label: "₹500 – ₹1,000", minPrice: 500, maxPrice: 1000 },
                      { label: "₹1,000 – ₹2,000", minPrice: 1000, maxPrice: 2000 },
                      { label: "Above ₹2,000", minPrice: 2000 },
                    ].map(({ label, minPrice: min, maxPrice: max }) => {
                      const isCurrentPrice = 
                        params.minPrice === String(min || "") && 
                        params.maxPrice === String(max || "")
                      
                      return (
                        <Link
                          key={label}
                          href={priceHref({ minPrice: min, maxPrice: max })}
                          className={`text-sm py-1.5 px-3 rounded-xl transition-all duration-200 ${
                            isCurrentPrice
                              ? "bg-rose-light/10 text-rose font-bold"
                              : "text-charcoal-light hover:text-charcoal hover:bg-slate-100/50"
                          }`}
                        >
                          {label}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Reset Filters */}
                {(params.category || params.minPrice || params.maxPrice) && (
                  <div className="pt-4 border-t border-slate-100/50 text-center">
                    <Link 
                      href="/shop" 
                      className="text-[10px] font-bold tracking-wider uppercase text-muted hover:text-rose transition-colors"
                    >
                      Reset All Filters
                    </Link>
                  </div>
                )}
              </div>
            </aside>

            {/* Product Display Panel */}
            <div className="flex-1">
              {products && products.length > 0 ? (
                <div className="product-grid gap-y-10">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="newsletter-glass text-center py-20 rounded-3xl p-12">
                  <p className="font-serif text-2xl text-charcoal mb-2">No luxury pieces found</p>
                  <p className="text-muted text-sm mb-6">Try clearing price filter criteria or browsing other categories.</p>
                  <Link href="/shop" className="store-button store-button-dark">
                    Browse All Accessories
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
