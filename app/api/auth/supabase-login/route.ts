import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import { setAuthCookie } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const requestSchema = z.object({
  accessToken: z.string().min(20),
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function POST(req: Request) {
  try {
    const parsed = requestSchema.safeParse(await req.json())

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid Google session payload' }, { status: 400 })
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Supabase auth is not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabase.auth.getUser(parsed.data.accessToken)

    if (error || !data.user?.email) {
      return NextResponse.json(
        { error: error?.message || 'Google account email is required' },
        { status: 401 },
      )
    }

    const user = await prisma.user.upsert({
      where: {
        email: data.user.email.toLowerCase(),
      },
      create: {
        email: data.user.email.toLowerCase(),
        fullName:
          typeof data.user.user_metadata?.full_name === 'string'
            ? data.user.user_metadata.full_name
            : typeof data.user.user_metadata?.name === 'string'
              ? data.user.user_metadata.name
              : data.user.email.split('@')[0],
        avatarUrl:
          typeof data.user.user_metadata?.avatar_url === 'string'
            ? data.user.user_metadata.avatar_url
            : typeof data.user.user_metadata?.picture === 'string'
              ? data.user.user_metadata.picture
              : undefined,
        role: 'customer',
      },
      update: {
        fullName:
          typeof data.user.user_metadata?.full_name === 'string'
            ? data.user.user_metadata.full_name
            : typeof data.user.user_metadata?.name === 'string'
              ? data.user.user_metadata.name
              : undefined,
        avatarUrl:
          typeof data.user.user_metadata?.avatar_url === 'string'
            ? data.user.user_metadata.avatar_url
            : typeof data.user.user_metadata?.picture === 'string'
              ? data.user.user_metadata.picture
              : undefined,
      },
    })

    await setAuthCookie(user)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Supabase Google login bridge failed:', error)
    return NextResponse.json({ error: 'Failed to complete Google sign in' }, { status: 500 })
  }
}
