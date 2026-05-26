import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    if (!process.env.RAZORPAY_SECRET) {
      return NextResponse.json({ success: true, verified: false, dev: true })
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex")

    const isValid = expectedSignature === razorpay_signature

    return NextResponse.json({ success: isValid, verified: isValid })
  } catch (error) {
    console.error("Payment verify error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
