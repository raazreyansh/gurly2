import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/product/ProductCard'

const FALLBACK_PRODUCTS = [
  { id: '101', title: 'Royal Jhumka', slug: 'royal-jhumka', price: 2999, compareAtPrice: 3999, images: ['/images/models/community_1.png'] },
  { id: '102', title: 'Luxury Pendant', slug: 'luxury-pendant', price: 4999, compareAtPrice: 5999, images: ['/images/models/community_2.png'] },
  { id: '103', title: 'Prestige Ring', slug: 'prestige-ring', price: 1999, compareAtPrice: null, images: ['/images/models/community_3.png'] },
  { id: '104', title: 'Classic Choker', slug: 'classic-choker', price: 8999, compareAtPrice: 9999, images: ['/images/models/community_4.png'] },
]

export default async function FeaturedProducts() {
  let products: any[] = []

  try {
    products = await prisma.product.findMany({
      where: {
        featured: true,
      },
      take: 4,
    })
  } catch (error) {
    console.error("Prisma featured product fetch error:", error)
  }

  const list = products.length > 0 ? products : FALLBACK_PRODUCTS

  return (
    <section className="px-8 py-24 lg:px-20 bg-white">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-12">
          <h2 className="font-serif text-3xl text-black">Featured Picks</h2>
          <p className="text-neutral-500 text-xs mt-2 uppercase tracking-widest font-semibold">Selected Treasures Of The Season</p>
        </div>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {list.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
