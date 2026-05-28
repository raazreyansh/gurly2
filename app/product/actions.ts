'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function submitReview(data: {
  productId: string
  rating: number
  comment: string
  customer: string
  slug: string
}) {
  try {
    if (!data.productId || !data.customer || !data.comment) {
      return { success: false, error: "Required fields missing" }
    }

    await prisma.review.create({
      data: {
        productId: data.productId,
        rating: Number(data.rating),
        comment: data.comment,
        customer: data.customer,
        verified: true,
      }
    })

    revalidatePath(`/product/${data.slug}`)
    return { success: true }
  } catch (error) {
    console.error("Prisma submitReview action error:", error)
    return { success: false, error: "Failed to submit customer review" }
  }
}
