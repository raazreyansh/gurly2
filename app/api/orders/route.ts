import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId = null, items = [], address = null, payment = null } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    // Compute total (assuming product.price provided as number)
    const total = items.reduce((sum: number, it: any) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0)

    const order = await prisma.order.create({
      data: {
        userId: userId ?? 'guest',
        total: Math.round(total),
        status: 'pending',
        items: {
          create: items.map((it: any) => ({ productId: it.productId, quantity: Number(it.quantity) || 1, price: Math.round(Number(it.price) || 0) }))
        },
        payments: payment ? { create: { provider: payment.provider ?? 'unknown', amount: Math.round(payment.amount || total), status: payment.status ?? 'pending' } } : undefined,
      },
      include: { items: true, payments: true }
    })

    return NextResponse.json({ id: order.id, status: order.status })
  } catch (err) {
    console.error('Order creation error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
