import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const orderRequestSchema = z.object({
  customer: z.object({
    name: z.string().min(2).max(120),
    phone: z.string().min(6).max(20),
    email: z.string().email().optional(),
  }).optional(),
  paymentMethod: z.string().min(2).max(40).optional(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().min(1).max(20),
    }),
  ).min(1),
})

const TAX_RATE = 0.18
const SHIPPING_FEE = 0

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = orderRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid order payload',
          details: parsed.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 },
      )
    }

    const requestedItems = parsed.data.items
    const productIds = [...new Set(requestedItems.map((item) => item.productId))]

    const result = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
        select: {
          id: true,
          title: true,
          price: true,
          stock: true,
        },
      })

      const productById = new Map(products.map((product) => [product.id, product]))

      for (const item of requestedItems) {
        const product = productById.get(item.productId)
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`)
        }
        if (product.stock < item.quantity) {
          throw new Error(`${product.title} has only ${product.stock} units available`)
        }
      }

      const subtotal = requestedItems.reduce((sum, item) => {
        const product = productById.get(item.productId)!
        return sum + Number(product.price) * item.quantity
      }, 0)
      const shipping = SHIPPING_FEE
      const tax = Number((subtotal * TAX_RATE).toFixed(2))
      const total = Number((subtotal + shipping + tax).toFixed(2))

      const guestEmail = parsed.data.customer?.email || 'guest@gurly.com'
      const user = await tx.user.upsert({
        where: {
          email: guestEmail,
        },
        create: {
          email: guestEmail,
          fullName: parsed.data.customer?.name || 'Guest Customer',
          phone: parsed.data.customer?.phone,
          role: 'customer',
        },
        update: {
          fullName: parsed.data.customer?.name || undefined,
          phone: parsed.data.customer?.phone || undefined,
        },
      })

      for (const item of requestedItems) {
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })

        if (updated.count !== 1) {
          throw new Error('Stock changed while placing the order. Please review your cart.')
        }
      }

      const order = await tx.order.create({
        data: {
          userId: user.id,
          total,
          status: 'PENDING',
          items: {
            create: requestedItems.map((item) => {
              const product = productById.get(item.productId)!
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
              }
            }),
          },
          payments: parsed.data.paymentMethod
            ? {
                create: {
                  provider: parsed.data.paymentMethod,
                  amount: total,
                  status: parsed.data.paymentMethod === 'cod' ? 'pending' : 'authorized',
                },
              }
            : undefined,
        },
        include: {
          items: true,
          payments: true,
        },
      })

      return {
        order,
        totals: {
          subtotal,
          shipping,
          tax,
          total,
        },
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Order creation API error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create order',
      },
      {
        status: 500,
      },
    )
  }
}
