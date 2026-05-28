'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { productSchema } from '@/lib/validations/product'

export interface ActionResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

function revalidateAll() {
  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath('/')
}

export async function deleteProduct(productId: string): Promise<ActionResponse> {
  try {
    if (!productId || typeof productId !== 'string') {
      return { success: false, error: 'Product ID is required and must be a string.' }
    }

    await prisma.product.delete({
      where: { id: productId }
    })

    revalidateAll()
    return { success: true }
  } catch (err: any) {
    console.error("Delete product action error:", err)
    return { success: false, error: err.message || "Failed to delete product" }
  }
}

export async function createProduct(rawData: any): Promise<ActionResponse> {
  try {
    // 1. Strict input validation using centralized Zod schema
    const parsed = productSchema.safeParse(rawData)
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')
      return { success: false, error: `Validation Failure: ${errorMsg}` }
    }

    const { categoryId, price, compareAtPrice, stock, ...rest } = parsed.data

    // 2. Safe Database Creation
    const product = await prisma.product.create({
      data: {
        ...rest,
        price,
        compareAtPrice: compareAtPrice || null,
        stock,
        categoryId,
      }
    })

    revalidateAll()
    return { success: true, data: { id: product.id } }
  } catch (err: any) {
    console.error("CREATE PRODUCT SERVER ERROR:", err)
    return { success: false, error: err.message || "Prisma Database Write Failure" }
  }
}

export async function updateProduct(productId: string, rawData: any): Promise<ActionResponse> {
  try {
    if (!productId || typeof productId !== 'string') {
      return { success: false, error: 'Product ID is required for editing.' }
    }

    // 1. Strict input validation using centralized Zod schema
    const parsed = productSchema.safeParse(rawData)
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')
      return { success: false, error: `Validation Failure: ${errorMsg}` }
    }

    const { categoryId, price, compareAtPrice, stock, ...rest } = parsed.data

    // 2. Safe Database Update
    await prisma.product.update({
      where: { id: productId },
      data: {
        ...rest,
        price,
        compareAtPrice: compareAtPrice || null,
        stock,
        categoryId,
      }
    })

    revalidateAll()
    revalidatePath(`/product/${parsed.data.slug}`)
    return { success: true }
  } catch (err: any) {
    console.error("UPDATE PRODUCT SERVER ERROR:", err)
    return { success: false, error: err.message || "Prisma Database Update Failure" }
  }
}

export async function toggleFeatured(productId: string, featured: boolean): Promise<ActionResponse> {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { featured: Boolean(featured) }
    })
    revalidateAll()
    return { success: true }
  } catch (err: any) {
    console.error("Toggle featured error:", err)
    return { success: false, error: err.message || "Failed to toggle featured status" }
  }
}
