import { ProductCard } from '@/components/product/ProductCard'
import { getProducts } from '@/services/products'

export async function Bestsellers() {
  const products = await getProducts({ limit: 4 })

  if (!products || products.length === 0) return null

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-3xl text-black">Bestsellers</h2>
            <p className="text-neutral-600 mt-2">Our most-loved earrings selected by customers.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Bestsellers
