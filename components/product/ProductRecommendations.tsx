import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

interface RecommendationsProps {
  categoryId: string
  currentId: string
}

export default async function ProductRecommendations({ categoryId, currentId }: RecommendationsProps) {
  let recommendations: any[] = []

  try {
    recommendations = await prisma.product.findMany({
      where: {
        categoryId,
        id: {
          not: currentId
        }
      },
      take: 4,
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error("Recommendations retrieval error:", error)
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="py-20 border-t border-neutral-100 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-serif text-3xl text-black uppercase tracking-wide mb-12">
          YOU MAY ALSO LIKE
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommendations.map((product) => {
            const imageArray = Array.isArray(product.images) ? product.images : []
            const firstImage = imageArray[0] || '/images/models/community_2.png'

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group flex flex-col gap-4 select-none"
              >
                <div className="relative aspect-[3/4] overflow-hidden border border-neutral-100 bg-[#F5F5F3] w-full">
                  <Image
                    src={firstImage}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-black group-hover:opacity-75 transition">
                    {product.title}
                  </h3>
                  <span className="font-mono text-[11px] text-neutral-500 font-bold">
                    ₹{Number(product.price).toLocaleString()}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
