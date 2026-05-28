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
  images: string[]
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
    await prisma.product.create({
      data: {
        title: data.title,
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: data.description || '',
        price: data.price,
        compareAtPrice: data.compareAtPrice || null,
        stock: data.stock,
        featured: data.featured,
        categoryId: data.categoryId,
        images: data.images.length > 0 ? data.images : ['/images/models/community_2.png'],
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

    revalidatePath('/admin/products')
    revalidatePath('/shop')
    revalidatePath('/')

    return { success: true }
  } catch (err) {
    console.error("Create product action error:", err)
    return { success: false, error: "Failed to create product entry" }
  }
}
