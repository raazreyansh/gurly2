import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const FALLBACK_CATEGORIES = [
  { id: '1', name: 'Earrings', slug: 'earrings', imageUrl: '/images/models/community_1.png' },
  { id: '2', name: 'Necklaces', slug: 'necklaces', imageUrl: '/images/models/community_2.png' },
  { id: '3', name: 'Rings', slug: 'rings', imageUrl: '/images/models/community_3.png' },
  { id: '4', name: 'Bracelets', slug: 'bracelets', imageUrl: '/images/models/community_4.png' },
]

export default async function EditorialCategories() {
  let categories: any[] = []

  try {
    categories = await prisma.category.findMany()
  } catch (error) {
    console.error("Prisma category fetch error:", error)
  }

  const list = categories.length > 0 ? categories : FALLBACK_CATEGORIES

  return (
    <section className="px-8 py-24 lg:px-20 bg-white">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-serif text-black">Shop By Category</h2>
            <p className="text-neutral-500 text-xs mt-2 uppercase tracking-widest font-semibold">Carefully Curated Capsules</p>
          </div>

          <Link
            href="/shop"
            className="text-[11px] font-semibold tracking-[0.3em] text-neutral-400 hover:text-black transition pb-1 border-b border-neutral-200 hover:border-black"
          >
            VIEW ALL
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {list.map((category) => (
            <Link
              href={`/shop?category=${category.slug}`}
              key={category.id}
              className="group block"
            >
              <div className="aspect-[3/4] overflow-hidden bg-neutral-50 border border-neutral-100 relative">
                <img
                  src={category.imageUrl || '/images/models/community_1.png'}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-black">
                  {category.name}
                </p>
                <span className="text-neutral-400 group-hover:text-black transition">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
