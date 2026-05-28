import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import DeleteProductButton from './DeleteProductButton'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error("Products catalog admin error:", error)
  }

  return (
    <div className="space-y-12">
      {/* Title */}
      <div className="border-b border-neutral-100 pb-6 flex flex-col sm:flex-row justify-between sm:items-end">
        <div>
          <h1 className="font-serif text-5xl text-black">Product Catalog</h1>
          <p className="text-neutral-500 text-xs mt-2 uppercase tracking-widest font-semibold">
            Manage Storefront Jewels & Stock Alerts
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="mt-4 sm:mt-0 bg-black text-white px-6 py-3.5 text-xs uppercase tracking-widest font-semibold hover:opacity-85 transition flex items-center gap-2 self-start"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {/* Grid List */}
      <div className="border border-neutral-200">
        <div className="overflow-x-auto">
          {products.length === 0 ? (
            <div className="p-16 text-center text-xs text-neutral-400 font-semibold tracking-wider bg-white">
              NO PRODUCTS FOUND IN CATALOG
            </div>
          ) : (
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="border-b border-neutral-200 text-[9px] tracking-[0.25em] font-bold text-neutral-400 uppercase bg-neutral-50/50">
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs text-black">
                {products.map((product) => {
                  let imageSrc = '/images/models/community_2.png'
                  const parseImageField = (val: any): string => {
                    if (!val) return '/images/models/community_2.png'
                    if (typeof val === 'string') return val
                    if (typeof val === 'object' && val.url) return val.url
                    return '/images/models/community_2.png'
                  }
                  
                  const mediaArray = Array.isArray(product.media) ? product.media : []
                  if (mediaArray.length > 0) {
                    imageSrc = parseImageField(mediaArray[0])
                  }

                  return (
                    <tr key={product.id} className="hover:bg-neutral-50/30 transition">
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="h-14 w-11 bg-neutral-50 border border-neutral-200 overflow-hidden flex-shrink-0 relative">
                          <img
                            src={imageSrc}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold uppercase tracking-wider text-black">{product.title}</p>
                          <span className="text-[10px] text-neutral-400 font-mono block mt-1 uppercase">
                            #{product.id.slice(0, 8)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-500 uppercase tracking-widest font-semibold text-[10px]">
                        {product.category?.name || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <div>
                          {product.featured ? (
                            <span className="px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase bg-black text-white">
                              Featured
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[8px] font-semibold tracking-widest uppercase border border-neutral-200 text-neutral-400">
                              Standard
                            </span>
                          )}
                        </div>
                        <div>
                          {product.trending && (
                            <span className="px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase bg-amber-500 text-white">
                              Trending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {product.stock === 0 ? (
                          <span className="text-red-500 font-bold uppercase tracking-wider">Out of Stock</span>
                        ) : (
                          <span className="font-mono text-neutral-600 font-semibold">{product.stock} units</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-black">
                        ₹{Number(product.price).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-2 text-neutral-400 hover:text-black transition inline-flex items-center"
                            title="Edit Product"
                          >
                            <Plus className="h-4 w-4 rotate-45" /> {/* Use Plus rotated 45deg or we can just import Pencil */}
                          </Link>
                          <DeleteProductButton id={product.id} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
