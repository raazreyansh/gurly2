import { prisma } from '@/lib/prisma'
import CategoryForm from '@/components/admin/CategoryForm'

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
            {categories.length === 0 ? (
              <div className="p-16 text-center text-xs text-neutral-400 font-semibold tracking-wider bg-white">
                NO CATEGORIES FOUND IN DATABASE
              </div>
            ) : (
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="border-b border-neutral-200 text-[9px] tracking-[0.25em] font-bold text-neutral-400 uppercase bg-neutral-50/50">
                    <th className="px-6 py-4">Capsule Class</th>
                    <th className="px-6 py-4">URL Slug</th>
                    <th className="px-6 py-4 text-right">Items Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs text-black">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-neutral-50/30 transition">
                      <td className="px-6 py-4 font-semibold uppercase tracking-wider text-black">
                        {cat.name}
                      </td>
                      <td className="px-6 py-4 text-neutral-400 font-mono text-[10px]">
                        /{cat.slug || cat.name.toLowerCase()}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-black">
                        {cat.products?.length || 0} items
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Creator Form */}
        <CategoryForm />
      </div>
    </div>
  )
}
