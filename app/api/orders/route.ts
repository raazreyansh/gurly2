import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Ensure we have a valid user record in the DB to associate the order with
    let user = await prisma.user.findFirst()
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "guest@gurly.com",
          fullName: "Guest Customer",
          role: "customer"
        }
      })
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: body.total,
        status: "pending",
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        },
      },
      include: {
        items: true
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Order creation API error:", error)
    return NextResponse.json(
      {
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : String(error)
      },
      {
        status: 500,
      },
    )
  }
}
