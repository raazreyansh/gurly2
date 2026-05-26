export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Webhook received:", body.event)
    // Handle payment.captured, payment.failed, etc.
    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }
}
