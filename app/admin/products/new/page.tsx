import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  let categories: any[] = []

  try {
    categories = await prisma.category.findMany()
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
