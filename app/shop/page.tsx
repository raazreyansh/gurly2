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

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Shop Catalog",
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
    <div className="storefront-shell bg-[#0C0C0C] min-h-screen text-[#FEFDF0] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Luxury Header */}
        <div className="py-16 bg-[#0E0E0E] border-b border-[#FEFDF0]/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles size={11} className="text-[#FFE600] animate-pulse" />
              <p className="text-[9px] font-extrabold tracking-[0.25em] text-[#FFE600] uppercase mb-0">Premium Discovery</p>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-[#FEFDF0]">
              {categoryName}
            </h1>
            <p className="text-[#A6A498] text-xs tracking-wider mt-3">
              Showing {(products?.length ?? 0)} premium piece{(products?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-16 px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Immersive Glass Sidebar Filters */}
            <aside className="w-full lg:w-[240px] flex-shrink-0">
              <div className="sticky top-[120px] p-8 bg-[#141414] border border-[#FEFDF0]/5 rounded-none space-y-10">
                
                <div className="flex items-center gap-2 pb-5 border-b border-[#FEFDF0]/5">
                  <SlidersHorizontal size={14} className="text-[#FFE600]" />
                  <span className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-[#FEFDF0]">FILTERS</span>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-[9px] font-extrabold tracking-[0.25em] uppercase text-[#FFE600] mb-5">CATEGORY</h3>
                  <div className="flex flex-col gap-1.5">
                    <Link
                      href="/shop"
                      className={`text-xs py-2 px-3 rounded-none transition-all duration-200 uppercase tracking-widest font-extrabold ${
                        !params.category
                          ? "bg-[#FFE600]/10 text-[#FFE600] border-l-2 border-[#FFE600]"
                          : "text-[#D4D2C5] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      All Pieces
                    </Link>
                    {categories?.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${cat.slug}`}
                        className={`text-xs py-2 px-3 rounded-none transition-all duration-200 uppercase tracking-widest font-extrabold ${
                          params.category === cat.slug
                            ? "bg-[#FFE600]/10 text-[#FFE600] border-l-2 border-[#FFE600]"
                            : "text-[#D4D2C5] hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Price Ranges */}
                <div>
                  <h3 className="text-[9px] font-extrabold tracking-[0.25em] uppercase text-[#FFE600] mb-5">PRICE RANGE</h3>
                  <div className="flex flex-col gap-1.5">
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
                          className={`text-xs py-2 px-3 rounded-none transition-all duration-200 uppercase tracking-widest font-extrabold ${
                            isCurrentPrice
                              ? "bg-[#FFE600]/10 text-[#FFE600] border-l-2 border-[#FFE600]"
                              : "text-[#D4D2C5] hover:text-white hover:bg-white/5"
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
                  <div className="pt-5 border-t border-[#FEFDF0]/5 text-center">
                    <Link 
                      href="/shop" 
                      className="text-[9px] font-extrabold tracking-widest uppercase text-[#FFE600] hover:text-white transition-colors"
                    >
                      RESET FILTERS
                    </Link>
                  </div>
                )}
              </div>
            </aside>

            {/* Product Display Panel */}
            <div className="flex-grow">
              {products && products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="bg-[#141414] border border-[#FEFDF0]/5 text-center py-24 p-12">
                  <p className="font-serif text-2xl text-[#FEFDF0] mb-3 font-light">No luxury pieces found</p>
                  <p className="text-[#A6A498] text-xs mb-8 max-w-md mx-auto">Try clearing price filter criteria or browsing other jewelry categories.</p>
                  <Link href="/shop" className="px-8 py-4 bg-[#FFE600] hover:bg-white text-black text-[10px] uppercase font-extrabold tracking-widest transition-colors duration-300">
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
