import { ProductCard } from '@/components/product/ProductCard'
import { getProducts } from '@/services/products'
import Link from 'next/link'

export async function Trending() {
  const products = await getProducts({ limit: 4 })

  if (!products || products.length === 0) return null

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-4xl text-black">Trending Now</h2>
          </div>
          <Link href="/shop" className="text-xs uppercase tracking-[0.1em] font-semibold text-black hover:opacity-60 transition border-b border-black pb-1 hidden sm:block">
            View Collection
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center sm:hidden">
          <Link href="/shop" className="inline-block border border-black px-8 py-4 text-xs uppercase tracking-[0.1em] font-semibold text-black hover:bg-black hover:text-white transition">
            View Collection
          </Link>
        </div>

      </div>
    </section>
  )
}
