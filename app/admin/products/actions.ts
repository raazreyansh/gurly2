'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

function revalidateAll() {
  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath('/')
}

export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId }
    })
    revalidateAll()
    return { success: true }
  } catch (err) {
    console.error("Delete product action error:", err)
    return { success: false, error: "Failed to delete product" }
  }
}

export async function toggleFeatured(productId: string, featured: boolean) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { featured }
    })
    revalidateAll()
    return { success: true }
  } catch (err) {
    console.error("Toggle featured error:", err)
    return { success: false, error: "Failed to toggle featured status" }
  }
}

export async function toggleTrending(productId: string, trending: boolean) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { trending }
    })
    revalidateAll()
    return { success: true }
  } catch (err) {
    console.error("Toggle trending error:", err)
    return { success: false, error: "Failed to toggle trending status" }
  }
}

interface ProductData {
  title: string
  slug: string
  shortDescription?: string
  description?: string
  price: number
  compareAtPrice?: number | null
  stock: number
  featured: boolean
  trending?: boolean
  categoryId: string
  media: any[]
  tags?: string[]
  seoTitle?: string
  seoDescription?: string
  material?: string
  plating?: string
  gemstone?: string
  antiTarnish?: boolean
  waterproof?: boolean
  hypoallergenic?: boolean
  handcrafted?: boolean
  shippingDays?: number
}

function buildProductPayload(data: ProductData) {
  return {
    title: String(data.title),
    slug: String(data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
    shortDescription: data.shortDescription || null,
    description: String(data.description || ''),
    price: Number(data.price),
    compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
    stock: Number(data.stock),
    featured: Boolean(data.featured),
    trending: Boolean(data.trending ?? false),
    categoryId: String(data.categoryId),
    media: data.media.length > 0 ? data.media : [{ type: 'image', url: '/images/models/community_2.png' }],
    tags: data.tags || [],
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    material: data.material || '18k Gold Plated',
    plating: data.plating || '24k Gold Overlay',
    gemstone: data.gemstone || 'None',
    antiTarnish: data.antiTarnish ?? true,
    waterproof: data.waterproof ?? true,
    hypoallergenic: data.hypoallergenic ?? true,
    handcrafted: data.handcrafted ?? true,
    shippingDays: data.shippingDays || 3,
  }
}

export async function createProduct(data: ProductData) {
  try {
    if (!data.categoryId || data.categoryId.trim() === "") {
      throw new Error("Category selection is required.")
    }

    const payload = buildProductPayload(data)
    const createdProduct = await prisma.product.create({ data: payload })

    revalidateAll()
    return { success: true, productId: createdProduct.id }
  } catch (err: any) {
    console.error("CREATE PRODUCT ERROR:", err)
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "Database write failure" 
    }
  }
}

export async function updateProduct(productId: string, data: ProductData) {
  try {
    if (!data.categoryId || data.categoryId.trim() === "") {
      throw new Error("Category selection is required.")
    }

    const payload = buildProductPayload(data)
    await prisma.product.update({
      where: { id: productId },
      data: payload
    })

    revalidateAll()
    revalidatePath(`/product/${data.slug}`)
    return { success: true }
  } catch (err: any) {
    console.error("UPDATE PRODUCT ERROR:", err)
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "Database update failure" 
    }
  }
}
