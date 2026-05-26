export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    console.log("Newsletter signup:", email)
    // Integrate with Resend or Mailchimp
    return Response.json({ success: true })
  } catch {
    return Response.json({ success: false }, { status: 400 })
  }
}
