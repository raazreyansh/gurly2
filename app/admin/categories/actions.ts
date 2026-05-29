'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { assertAdminUser } from '@/lib/auth'

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function revalidateCatalogue() {
  revalidatePath('/admin/categories')
  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath('/')
}

export async function createCategory(name: string) {
  try {
    await assertAdminUser()

    const slug = slugify(name)
    if (!name.trim() || !slug) {
      return { success: false, error: 'Category name is required.' }
    }
    
    await prisma.category.create({
      data: {
        name: name.trim(),
        slug
      }
    })

    revalidateCatalogue()

    return { success: true }
  } catch (err) {
    console.error("Create category server action error:", err)
    return { success: false, error: "Category naming conflict or write failure." }
  }
}

export async function updateCategory(categoryId: string, rawName: string, rawSlug?: string) {
  try {
    await assertAdminUser()

    const name = rawName.trim()
    const slug = slugify(rawSlug || rawName)

    if (!categoryId || !name || !slug) {
      return { success: false, error: 'Category name and slug are required.' }
    }

    await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        slug,
      },
    })

    revalidateCatalogue()
    return { success: true }
  } catch (err) {
    console.error("Update category server action error:", err)
    return { success: false, error: "Category update failed. Check for duplicate slugs." }
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    await assertAdminUser()

    if (!categoryId) {
      return { success: false, error: 'Category ID is required.' }
    }

    const productCount = await prisma.product.count({
      where: {
        categoryId,
      },
    })

    if (productCount > 0) {
      return {
        success: false,
        error: `Move or delete ${productCount} product(s) before deleting this category.`,
      }
    }

    await prisma.category.delete({
      where: { id: categoryId },
    })

    revalidateCatalogue()
    return { success: true }
  } catch (err) {
    console.error("Delete category server action error:", err)
    return { success: false, error: "Category delete failed." }
  }
}
