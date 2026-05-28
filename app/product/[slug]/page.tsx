import { getProductBySlug, getProducts } from "@/services/products"
import { StorefrontLayout } from "@/components/layout/StorefrontLayout"
import { ProductDetailClient } from "@/components/product/ProductDetailClient"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Product Not Found" }
  return {
    title: product.title,
    description: product.description ?? undefined,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [product, related] = await Promise.all([
    getProductBySlug(slug),
    getProducts({ limit: 4 }),
  ])

  if (!product) notFound()

  return (
    <StorefrontLayout>
      <main className="bg-white min-h-screen">
        <ProductDetailClient product={product} related={related ?? []} />
      </main>
    </StorefrontLayout>
  )
}
