'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createCategory(name: string) {
  try {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    await prisma.category.create({
      data: {
        name,
        slug
      }
    })

    revalidatePath('/admin/categories')
    revalidatePath('/admin/products')
    revalidatePath('/shop')

    return { success: true }
  } catch (err) {
    console.error("Create category server action error:", err)
    return { success: false, error: "Category naming conflict or write failure." }
  }
}
