import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { amount } = await req.json()

    // Razorpay order creation
    // Requires RAZORPAY_KEY_ID and RAZORPAY_SECRET in env
    if (!process.env.RAZORPAY_KEY_ID) {
      // Return a mock order for development
      return NextResponse.json({
        id: `mock_order_${Date.now()}`,
        amount: amount * 100,
        currency: "INR",
        status: "created",
      })
    }

    const credentials = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_SECRET}`
    ).toString("base64")

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      }),
    })

    const order = await response.json()
    return NextResponse.json(order)
  } catch (error) {
    console.error("Payment create error:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
