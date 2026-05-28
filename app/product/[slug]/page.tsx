import { prisma } from '@/lib/prisma'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import ProductRecommendations from '@/components/product/ProductRecommendations'
import ProductReviews from '@/components/product/ProductReviews'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-dynamic'

// 12. Dynamic SEO Metadata Generator
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug }
  })

  if (!product) return {}

  const imageArray = Array.isArray(product.images) ? product.images : []
  const firstImage = (imageArray[0] as string) || '/images/models/community_2.png'
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
      type: 'og:product'
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

  const imageArray = Array.isArray(product.images) ? product.images : []
  const firstImage = (imageArray[0] as string) || '/images/models/community_2.png'

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
        <ProductGallery product={product} />

        {/* Right Side: Description attributes */}
        <div className="border-l border-neutral-100">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Customer Verified Reviews */}
      <ProductReviews
        productId={product.id}
        slug={product.slug || ''}
        reviews={product.reviews}
      />

      {/* Related picks recommendations */}
      <ProductRecommendations
        categoryId={product.categoryId || ''}
        currentId={product.id}
      />
    </div>
  )
}
