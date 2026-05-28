'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })

    revalidatePath('/admin/orders')
    revalidatePath('/admin')

    return { success: true }
  } catch (err) {
    console.error("Update order status server action error:", err)
    return { success: false, error: "Failed to update order status" }
  }
}
