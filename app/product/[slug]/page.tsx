import { prisma } from '@/lib/prisma'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import ProductRecommendations from '@/components/product/ProductRecommendations'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function ProductPage({
  params,
}: Props) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      reviews: true,
      category: true,
    },
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white text-black pt-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-neutral-100">
        {/* Left Side: Editorial Image Workspace */}
        <ProductGallery product={product} />

        {/* Right Side: Attributes, Specs, Guarantees & Buying controls */}
        <div className="border-l border-neutral-100">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Recommended Carousel */}
      <ProductRecommendations
        categoryId={product.categoryId || ''}
        currentId={product.id}
      />
    </div>
  )
}
