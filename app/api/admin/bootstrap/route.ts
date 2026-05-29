import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const bootstrapSchema = z.object({
  email: z.string().email(),
  secret: z.string().min(8),
})

function normalizeSecret(value: string) {
  return value
    .replace(/\uFEFF/g, '')
    .replace(/\\r|\\n/g, '')
    .trim()
}

export async function POST(req: Request) {
  const adminSecret = process.env.ADMIN_BOOTSTRAP_SECRET

  if (!adminSecret) {
    return NextResponse.json(
      {
        error: 'ADMIN_BOOTSTRAP_SECRET is not configured.',
      },
      { status: 503 },
    )
  }

  const parsed = bootstrapSchema.safeParse(await req.json().catch(() => null))

  if (!parsed.success || normalizeSecret(parsed.data.secret) !== normalizeSecret(adminSecret)) {
    return NextResponse.json(
      {
        error: 'Invalid admin bootstrap request.',
      },
      { status: 403 },
    )
  }

  const user = await prisma.user.upsert({
    where: {
      email: parsed.data.email.toLowerCase(),
    },
    create: {
      email: parsed.data.email.toLowerCase(),
      fullName: parsed.data.email.split('@')[0],
      role: 'admin',
    },
    update: {
      role: 'admin',
    },
  })

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  })
}
