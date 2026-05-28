import { prisma } from '@/lib/prisma'
import ProductCard from './ProductCard'

export default async function ProductRecommendations({
  categoryId,
  currentId,
}: {
  categoryId: string
  currentId?: string
}) {
  let products: any[] = []

  try {
    products = await prisma.product.findMany({
      where: {
        categoryId,
        // Exclude the current product to avoid redundancy
        id: currentId ? { not: currentId } : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 4,
    })
  } catch (error) {
    console.error("Prisma recommendations fetch error:", error)
  }

  // If we have fewer than 2 related products, let's fetch any other popular items
  if (products.length < 2) {
    try {
      products = await prisma.product.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 4,
      })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <section className="border-t border-neutral-100 bg-white px-8 py-24 lg:px-20 select-none">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-14">
          <p className="text-[10px] tracking-[0.35em] text-neutral-400 font-bold uppercase mb-3">
            STYLE CO-ORDINATES
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-black uppercase">
            You May Also Like.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {products.map((product) => (
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
