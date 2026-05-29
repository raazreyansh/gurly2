import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function GET(req: Request) {
    if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      {
        enabled: false,
        error: 'Supabase auth environment variables are missing.',
      },
    )
  }

  const origin = new URL(req.url).origin
  const callbackUrl = `${origin}/auth/callback`
  const authorizeUrl = new URL('/auth/v1/authorize', supabaseUrl)
  authorizeUrl.searchParams.set('provider', 'google')
  authorizeUrl.searchParams.set('redirect_to', callbackUrl)

  try {
    const response = await fetch(authorizeUrl, {
      redirect: 'manual',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    })

    if (response.status >= 300 && response.status < 400) {
      return NextResponse.json({ enabled: true })
    }

    const payload = await response.json().catch(() => null)
    const errorMessage =
      typeof payload?.msg === 'string'
        ? payload.msg
        : typeof payload?.error_description === 'string'
          ? payload.error_description
          : 'Google provider is not enabled in Supabase Auth.'

    return NextResponse.json(
      {
        enabled: false,
        error: errorMessage,
      },
    )
  } catch (error) {
    console.error('Google provider status check failed:', error)
    return NextResponse.json(
      {
        enabled: false,
        error: 'Unable to verify Google provider status.',
      },
    )
  }
}
