import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/product/ProductCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const FALLBACK_CATEGORIES = [
  { id: '1', name: 'Earrings', slug: 'earrings' },
  { id: '2', name: 'Necklaces', slug: 'necklaces' },
  { id: '3', name: 'Rings', slug: 'rings' },
  { id: '4', name: 'Bracelets', slug: 'bracelets' },
]

const FALLBACK_PRODUCTS = [
  { id: '101', title: 'Royal Jhumka', slug: 'royal-jhumka', price: 2999, compareAtPrice: 3999, media: [{ type: 'image', url: '/images/models/community_1.png' }], category: { slug: 'earrings' } },
  { id: '102', title: 'Luxury Pendant', slug: 'luxury-pendant', price: 4999, compareAtPrice: 5999, media: [{ type: 'image', url: '/images/models/community_2.png' }], category: { slug: 'necklaces' } },
  { id: '103', title: 'Prestige Ring', slug: 'prestige-ring', price: 1999, compareAtPrice: null, media: [{ type: 'image', url: '/images/models/community_3.png' }], category: { slug: 'rings' } },
  { id: '104', title: 'Classic Choker', slug: 'classic-choker', price: 8999, compareAtPrice: 9999, media: [{ type: 'image', url: '/images/models/community_4.png' }], category: { slug: 'necklaces' } },
]

interface ShopPageProps {
  searchParams: Promise<{
    category?: string
  }>
}

export default async function ShopPage({
  searchParams,
}: ShopPageProps) {
  const { category: activeCategory } = await searchParams

  let categories: any[] = []
  let products: any[] = []

  try {
    categories = await prisma.category.findMany()
    products = await prisma.product.findMany({
      where: activeCategory
        ? {
            category: {
              slug: activeCategory,
            },
          }
        : undefined,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  } catch (error) {
    console.error("Prisma shop catalog error:", error)
  }

  const finalCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES
  let finalProducts = products.length > 0 ? products : FALLBACK_PRODUCTS

  // Filter fallback products locally if active category is selected
  if (products.length === 0 && activeCategory) {
    finalProducts = FALLBACK_PRODUCTS.filter(p => p.category.slug === activeCategory)
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
      {/* Category Filter Sidebar */}
      <aside className="border-r border-neutral-200 p-8 lg:p-12 bg-white">
        <h2 className="mb-8 text-xs font-semibold tracking-[0.3em] text-neutral-400 uppercase">
          CATEGORIES
        </h2>

        <div className="space-y-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-4 lg:gap-0 pb-4 lg:pb-0 hide-scrollbar">
          <Link
            href="/shop"
            className={`block text-xs uppercase tracking-widest font-semibold whitespace-nowrap transition ${
              !activeCategory ? 'text-black underline' : 'text-neutral-500 hover:text-black'
            }`}
          >
            All Products
          </Link>
          {finalCategories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className={`block text-xs uppercase tracking-widest font-semibold whitespace-nowrap transition ${
                activeCategory === category.slug ? 'text-black underline' : 'text-neutral-500 hover:text-black'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </aside>

      {/* Products Grid Section */}
      <section className="p-8 lg:p-12 bg-white">
        <div className="mb-12 border-b border-neutral-100 pb-6 flex items-end justify-between">
          <div>
            <h1 className="font-serif text-5xl text-black">Shop Collection</h1>
            <p className="text-neutral-500 text-xs mt-2 uppercase tracking-widest font-semibold">
              Showing {finalProducts.length} items
            </p>
          </div>
        </div>

        {finalProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
            {finalProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <p className="font-serif text-2xl text-neutral-400">No products found in this category.</p>
          </div>
        )}
      </section>
    </div>
  )
}
