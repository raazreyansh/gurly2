'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId }
    })
    
    revalidatePath('/admin/products')
    revalidatePath('/shop')
    revalidatePath('/')
    
    return { success: true }
  } catch (err) {
    console.error("Delete product action error:", err)
    return { success: false, error: "Failed to delete product" }
  }
}

export async function createProduct(data: {
  title: string
  slug: string
  description?: string
  price: number
  compareAtPrice?: number | null
  stock: number
  featured: boolean
  categoryId: string
  media: any[]
  // Support luxury specifications as well
  material?: string
  plating?: string
  gemstone?: string
  antiTarnish?: boolean
  waterproof?: boolean
  hypoallergenic?: boolean
  handcrafted?: boolean
  shippingDays?: number
}) {
  try {
    console.log("SERVER ACTION: Received categoryId =", data.categoryId)

    if (!data.categoryId || data.categoryId.trim() === "") {
      throw new Error("Validation Error: Category selection is required and cannot be empty.")
    }

    const createdProduct = await prisma.product.create({
      data: {
        title: String(data.title),
        slug: String(data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
        description: String(data.description || ''),
        price: Number(data.price),
        compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
        stock: Number(data.stock),
        featured: Boolean(data.featured),
        categoryId: String(data.categoryId),
        media: data.media.length > 0 ? data.media : [{ type: 'image', url: '/images/models/community_2.png' }],
        material: data.material || '18k Gold Plated',
        plating: data.plating || '24k Gold Overlay',
        gemstone: data.gemstone || 'None',
        antiTarnish: data.antiTarnish ?? true,
        waterproof: data.waterproof ?? true,
        hypoallergenic: data.hypoallergenic ?? true,
        handcrafted: data.handcrafted ?? true,
        shippingDays: data.shippingDays || 3
      }
    })

    console.log("SERVER ACTION: Product created successfully:", createdProduct.id)

    revalidatePath('/admin/products')
    revalidatePath('/shop')
    revalidatePath('/')

    return { success: true }
  } catch (err: any) {
    console.error("CREATE PRODUCT SERVER ERROR DETECTED:", err)
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "Prisma Database Write Failure" 
    }
  }
}
