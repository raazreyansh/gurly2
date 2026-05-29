'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { type ProductInput, productSchema } from '@/lib/validations/product'
import { normalizeProductMedia } from '@/lib/product-media'
import { assertAdminUser } from '@/lib/auth'

export interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

type RawProductInput = Partial<ProductInput> & {
  title?: unknown
  slug?: unknown
  media?: unknown
}

function revalidateAll() {
  revalidatePath('/admin/products')
  revalidatePath('/admin/products/new')
  revalidatePath('/admin')
  revalidatePath('/shop')
  revalidatePath('/')
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

function prepareProductInput(rawData: RawProductInput) {
  return {
    ...rawData,
    title: typeof rawData?.title === 'string' ? rawData.title.trim() : rawData?.title,
    slug: slugify(String(rawData?.slug || rawData?.title || '')),
    media: normalizeProductMedia(rawData?.media),
  }
}

export async function deleteProduct(productId: string): Promise<ActionResponse> {
  try {
    await assertAdminUser()

    if (!productId || typeof productId !== 'string') {
      return { success: false, error: 'Product ID is required and must be a string.' }
    }

    await prisma.product.delete({
      where: { id: productId }
    })

    revalidateAll()
    return { success: true }
  } catch (err: unknown) {
    console.error("Delete product action error:", err)
    return { success: false, error: getErrorMessage(err, "Failed to delete product") }
  }
}

export async function createProduct(rawData: RawProductInput): Promise<ActionResponse<{ id: string }>> {
  try {
    await assertAdminUser()

    // 1. Strict input validation using centralized Zod schema
    const parsed = productSchema.safeParse(prepareProductInput(rawData))
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
  } catch (err: unknown) {
    console.error("CREATE PRODUCT SERVER ERROR:", err)
    return { success: false, error: getErrorMessage(err, "Prisma Database Write Failure") }
  }
}

export async function updateProduct(productId: string, rawData: RawProductInput): Promise<ActionResponse> {
  try {
    await assertAdminUser()

    if (!productId || typeof productId !== 'string') {
      return { success: false, error: 'Product ID is required for editing.' }
    }

    // 1. Strict input validation using centralized Zod schema
    const parsed = productSchema.safeParse(prepareProductInput(rawData))
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
  } catch (err: unknown) {
    console.error("UPDATE PRODUCT SERVER ERROR:", err)
    return { success: false, error: getErrorMessage(err, "Prisma Database Update Failure") }
  }
}

export async function toggleFeatured(productId: string, featured: boolean): Promise<ActionResponse> {
  try {
    await assertAdminUser()

    await prisma.product.update({
      where: { id: productId },
      data: { featured: Boolean(featured) }
    })
    revalidateAll()
    return { success: true }
  } catch (err: unknown) {
    console.error("Toggle featured error:", err)
    return { success: false, error: getErrorMessage(err, "Failed to toggle featured status") }
  }
}
