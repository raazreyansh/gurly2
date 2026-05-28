export const dynamic = "force-dynamic"

import { ProductCard } from "@/components/product/ProductCard"
import { getProducts, getCategories } from "@/services/products"
import Link from "next/link"
import { StorefrontLayout } from "@/components/layout/StorefrontLayout"

type Props = {
  searchParams: Promise<{ category?: string }>
}

export default async function ShopPage({ searchParams }: Props) {
  const { category: activeCategorySlug } = await searchParams

  const [products, categories] = await Promise.all([
    getProducts(activeCategorySlug ? { categorySlug: activeCategorySlug } : undefined),
    getCategories(),
  ])

  return (
    <StorefrontLayout>
      <main className="bg-white min-h-screen pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <h1 className="font-serif text-5xl md:text-6xl text-black">Collection</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar Categories */}
            <div className="lg:col-span-3">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-400 mb-6 font-sans">Categories</h3>
              <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 hide-scrollbar">
                <Link
                  href="/shop"
                  className={`text-sm tracking-wide transition-colors whitespace-nowrap ${
                    !activeCategorySlug ? 'text-black font-semibold' : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  All Products
                </Link>
                {categories?.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    className={`text-sm tracking-wide transition-colors whitespace-nowrap ${
                      activeCategorySlug === cat.slug ? 'text-black font-semibold' : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-9">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
                <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">Showing {products.length} products</p>
              </div>

              {products && products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 animate-fade-in">
                  {products.map((product, i) => (
                    <ProductCard key={product.id} product={product} priority={i < 4} />
                  ))}
                </div>
              ) : (
                <div className="py-32 text-center">
                  <p className="font-serif text-2xl text-neutral-400">No products found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </StorefrontLayout>
  )
}
