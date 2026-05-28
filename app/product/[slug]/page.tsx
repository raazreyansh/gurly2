import { prisma } from '@/lib/prisma'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import ProductRecommendations from '@/components/product/ProductRecommendations'
import ProductReviews from '@/components/product/ProductReviews'
import { notFound } from 'next/navigation'
import { getPrimaryProductImage, normalizeProductMedia } from '@/lib/product-media'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

// 12. Dynamic SEO Metadata Generator
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug }
  })

  if (!product) return {}

  const firstImage = getPrimaryProductImage(product.media)
  const domain = 'https://gurly.luxury'

  return {
    title: `${product.title} | GURLY Luxury Editorial`,
    description: product.description || 'Exclusive luxury jewellery collection handcrafted with premium specifications.',
    openGraph: {
      title: product.title,
      description: product.description || 'Exclusive luxury jewellery collection.',
      url: `${domain}/product/${product.slug}`,
      images: [
        {
          url: firstImage.startsWith('http') ? firstImage : `${domain}${firstImage}`,
          width: 800,
          height: 1000,
          alt: product.title
        }
      ],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description || 'Exclusive luxury jewellery collection.'
    }
  }
}

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

  const safeProduct = {
    ...product,
    media: normalizeProductMedia(product.media),
  }
  const firstImage = getPrimaryProductImage(safeProduct.media)

  // 13. Rich JSON-LD Product Schema
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": firstImage.startsWith('http') ? firstImage : `https://gurly.luxury${firstImage}`,
    "description": product.description || 'Luxury handcrafted editorial jewelry.',
    "sku": product.id,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": "GURLY"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://gurly.luxury/product/${product.slug}`,
      "priceCurrency": "INR",
      "price": Number(product.price),
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "priceValidUntil": "2030-01-01"
    }
  }

  return (
    <div className="min-h-screen bg-white text-black pt-16">
      {/* JSON-LD Script tag for Search indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdSchema),
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-neutral-100">
        {/* Left Side: Photo preview workspace */}
        <ProductGallery product={safeProduct} />

        {/* Right Side: Description attributes */}
        <div className="border-l border-neutral-100">
          <ProductInfo product={safeProduct} />
        </div>
      </div>

      {/* Customer Verified Reviews */}
      <ProductReviews
        productId={safeProduct.id}
        slug={safeProduct.slug || ''}
        reviews={safeProduct.reviews}
      />

      {/* Related picks recommendations */}
      <ProductRecommendations
        categoryId={safeProduct.categoryId || ''}
        currentId={safeProduct.id}
      />
    </div>
  )
}
