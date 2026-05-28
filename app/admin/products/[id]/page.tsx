import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { category: true } }),
    prisma.category.findMany(),
  ])

  if (!product) notFound()

  // Serialize Decimal fields to numbers for the client
  const serialized = {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    media: Array.isArray(product.media) ? product.media : [],
    tags: product.tags || [],
  }

  return (
    <div className="space-y-12">
      <div className="border-b border-neutral-100 pb-6 flex items-end justify-between">
        <div>
          <Link
            href="/admin/products"
            className="text-[10px] tracking-widest font-semibold uppercase text-neutral-400 hover:text-black transition flex items-center gap-1.5 mb-3"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Catalog
          </Link>
          <h1 className="font-serif text-5xl text-black">Edit Product</h1>
          <p className="text-neutral-500 text-xs mt-2 uppercase tracking-widest font-semibold">
            #{product.id.slice(0, 8)} &middot; {product.title}
          </p>
        </div>
      </div>

      <ProductForm categories={categories} existingProduct={serialized as any} />
    </div>
  )
}
