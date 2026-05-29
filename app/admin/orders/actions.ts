'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { assertAdminUser } from '@/lib/auth'

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await assertAdminUser()

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
