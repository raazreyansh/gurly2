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
      <main className="bg-white min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        <header className="mb-16">
          <h1 className="font-serif text-5xl md:text-6xl text-black mb-8">
            Collection
          </h1>
          
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition ${
                !activeCategorySlug ? 'bg-black text-white' : 'bg-neutral-100 text-black hover:bg-neutral-200'
              }`}
            >
              All
            </Link>
            
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition ${
                  activeCategorySlug === cat.slug ? 'bg-black text-white' : 'bg-neutral-100 text-black hover:bg-neutral-200'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </header>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
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
    </main>
    </StorefrontLayout>
  )
}
