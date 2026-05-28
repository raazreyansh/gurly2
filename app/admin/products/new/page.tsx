import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  let categories: any[] = []

  try {
    categories = await prisma.category.findMany()
    if (categories.length === 0) {
      console.log("Empty database detected. Seeding categories in-flight...")
      await prisma.category.createMany({
        data: [
          { name: 'Earrings', slug: 'earrings', imageUrl: '/images/models/community_1.png' },
          { name: 'Necklaces', slug: 'necklaces', imageUrl: '/images/models/community_2.png' },
          { name: 'Rings', slug: 'rings', imageUrl: '/images/models/community_3.png' },
          { name: 'Bracelets', slug: 'bracelets', imageUrl: '/images/models/community_4.png' },
        ]
      })
      categories = await prisma.category.findMany()
    }
  } catch (error) {
    console.error("New product fetch category error:", error)
  }

  return (
    <div className="space-y-12">
      {/* Title */}
      <div className="border-b border-neutral-100 pb-6">
        <h1 className="font-serif text-5xl text-black">New Product</h1>
        <p className="text-neutral-500 text-xs mt-2 uppercase tracking-widest font-semibold">
          Insert Dynamic Jewel Listings to Catalog
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
