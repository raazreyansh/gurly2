import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Login required before payment verification' },
        { status: 401 },
      )
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    const secret = process.env.RAZORPAY_SECRET || ''
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex')

    if (generated_signature === razorpay_signature) {
      return NextResponse.json({ verified: true })
    } else {
      return NextResponse.json(
        { verified: false, error: "Signature mismatch. Tampering detected." },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Razorpay signature verification failed:", error)
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    )
  }
}
