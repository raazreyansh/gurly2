import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export default async function TrendingScroller() {
  let products: any[] = []

  try {
    products = await prisma.product.findMany({
      take: 8,
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error("Prisma TrendingScroller query error:", error)
  }

  // Fallback if database is empty
  const list = products.length > 0 ? products : [
    { id: 't1', title: 'Royal Jhumka Set', slug: 'royal-jhumka', price: 2999, images: ['/images/models/community_1.png'] },
    { id: 't2', title: 'Gold Pendant Necklace', slug: 'luxury-pendant', price: 4999, images: ['/images/models/community_2.png'] },
    { id: 't3', title: 'Solid Gold Ring', slug: 'prestige-ring', price: 1999, images: ['/images/models/community_3.png'] },
    { id: 't4', title: 'Classic Choker Set', slug: 'classic-choker', price: 8999, images: ['/images/models/community_4.png'] },
  ]

  return (
    <section className="overflow-hidden border-t border-neutral-100 bg-white py-24 select-none">
      <div className="mx-auto max-w-[1600px] px-8 lg:px-20 mb-12">
        <p className="text-[10px] tracking-[0.35em] text-neutral-400 font-bold uppercase mb-3">
          TRENDING ACROSS THE GLOBE
        </p>
        <h2 className="font-serif text-4xl lg:text-5xl text-black uppercase">
          Trending Now.
        </h2>
      </div>

      {/* Horizontal horizontal flex scroller bar */}
      <div className="flex gap-6 overflow-x-auto px-8 lg:px-20 pb-8 scrollbar-hide snap-x snap-mandatory">
        {list.map((product) => {
          const imgArray = Array.isArray(product.media) 
            ? product.media 
            : Array.isArray(product.images) 
            ? product.images 
            : []
          const parseImageField = (val: any): string => {
            if (!val) return '/images/models/community_2.png'
            if (typeof val === 'string') return val
            if (typeof val === 'object' && val.url) return val.url
            return '/images/models/community_2.png'
          }
          const firstImage = parseImageField(imgArray[0])

          return (
            <Link
              href={`/product/${product.slug}`}
              key={product.id}
              className="min-w-[280px] sm:min-w-[340px] bg-[#FAF9F6] border border-neutral-200/50 p-4 transition-all duration-300 hover:border-black snap-start group block"
            >
              {/* Image preview with zoom */}
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 border border-neutral-200/20">
                <Image
                  src={firstImage}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 280px, 340px"
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                />
              </div>

              {/* Attributes details info */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black truncate max-w-[180px]">
                    {product.title}
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-semibold tracking-widest uppercase mt-1">
                    GURLY Couture
                  </p>
                </div>

                <p className="text-xs font-mono font-bold text-black bg-white px-3 py-1 border border-neutral-200/60 rounded-full">
                  ₹{Number(product.price).toLocaleString()}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
