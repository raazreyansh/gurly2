import Razorpay from 'razorpay'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_SECRET || '',
})

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Login required before payment' },
        { status: 401 },
      )
    }

    const { amount } = await req.json()

    // Razorpay amounts are represented in paise (e.g. ₹100.00 = 10000 paise)
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)
    
    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    })
  } catch (error) {
    console.error("Razorpay payment initialization error:", error)
    return NextResponse.json(
      { error: "Failed to create Razorpay payment order" },
      { status: 500 }
    )
  }
}
