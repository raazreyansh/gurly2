import { prisma } from '@/lib/prisma'
import CategoryForm from '@/components/admin/CategoryForm'
import CategoryTableClient from '@/components/admin/CategoryTableClient'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  let categories: any[] = []
  try {
    categories = await prisma.category.findMany({
      include: {
        products: {
          select: { id: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
  } catch (error) {
    console.error("Categories catalog admin error:", error)
  }

  return (
    <div className="space-y-12">
      {/* Title */}
      <div className="border-b border-neutral-100 pb-6">
        <h1 className="font-serif text-5xl text-black">Product Categories</h1>
        <p className="text-neutral-500 text-xs mt-2 uppercase tracking-widest font-semibold">
          Manage Boutique Capsule Classes & Inventory Distribution
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Table List */}
        <div className="lg:col-span-2 border border-neutral-200">
          <div className="overflow-x-auto">
            <CategoryTableClient categories={categories} />
          </div>
        </div>

        {/* Creator Form */}
        <CategoryForm />
      </div>
    </div>
  )
}
