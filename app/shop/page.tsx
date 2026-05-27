import { getProducts, getCategories } from "@/services/products"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import { ProductCard } from "@/components/product/ProductCard"

interface SearchParams {
  category?: string
  minPrice?: string
  maxPrice?: string
}

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Shop",
  description: "Browse all GURLY jewelry — earrings, necklaces, bracelets and accessories.",
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
    { label: "₹500–1K", minPrice: 500, maxPrice: 1000 },
    { label: "₹1K–2K", minPrice: 1000, maxPrice: 2000 },
    { label: "₹2K+", minPrice: 2000 },
  ]

  function priceHref(min?: number, max?: number) {
    const p = new URLSearchParams()
    if (params.category) p.set("category", params.category)
    if (min) p.set("minPrice", String(min))
    if (max) p.set("maxPrice", String(max))
    return `/shop?${p.toString()}`
  }

  const hasFilters = params.category || params.minPrice || params.maxPrice

  return (
    <div className="bg-white min-h-screen text-black font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow pt-14">
        {/* Category + Price pills */}
        <div className="border-b border-[#E8E8E8] overflow-x-auto">
          <div className="flex items-center gap-0 max-w-[1400px] mx-auto px-6 md:px-10">
            {allCategories.map((cat) => {
              const isActive = cat.slug ? params.category === cat.slug : !params.category
              const href = cat.slug ? `/shop?category=${cat.slug}` : "/shop"
              return (
                <Link
                  key={cat.id}
                  href={href}
                  className={`shrink-0 px-5 py-3.5 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${
                    isActive ? "border-black text-black" : "border-transparent text-black/40 hover:text-black"
                  }`}
                >
                  {cat.name}
                </Link>
              )
            })}
            <div className="w-px h-4 bg-[#E8E8E8] mx-2 shrink-0" />
            {priceRanges.map((pr) => {
              const isActive = params.minPrice === String(pr.minPrice ?? "") && params.maxPrice === String(pr.maxPrice ?? "")
              return (
                <Link
                  key={pr.label}
                  href={priceHref(pr.minPrice, pr.maxPrice)}
                  className={`shrink-0 px-5 py-3.5 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${
                    isActive ? "border-black text-black" : "border-transparent text-black/40 hover:text-black"
                  }`}
                >
                  {pr.label}
                </Link>
              )
            })}
            {hasFilters && (
              <>
                <div className="w-px h-4 bg-[#E8E8E8] mx-2 shrink-0" />
                <Link
                  href="/shop"
                  className="shrink-0 px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-black transition-colors border-b-2 border-transparent"
                >
                  Clear ×
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Count */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-5 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/30">
            {products?.length ?? 0} items
          </p>
        </div>

        {/* Product Grid */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-16">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center">
              <p className="text-[11px] font-black uppercase tracking-widest text-black/30 mb-6">No products found</p>
              <Link href="/shop" className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 hover:bg-neutral-800 transition-colors">
                View All
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
