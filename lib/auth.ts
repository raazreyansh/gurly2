import crypto from 'crypto'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { User } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const SESSION_COOKIE = 'gurly_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 30

type SessionPayload = {
  userId: string
  email: string | null
  exp: number
}

function getAuthSecret() {
  return (
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.DATABASE_URL ||
    'gurly-development-session-secret'
  )
}

function encode(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString('base64url')
}

function decodePayload(value: string): SessionPayload | null {
  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as SessionPayload
  } catch {
    return null
  }
}

function sign(payload: string) {
  return crypto.createHmac('sha256', getAuthSecret()).update(payload).digest('base64url')
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

export function createSessionToken(user: Pick<User, 'id' | 'email'>) {
  const payload = encode({
    userId: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  } satisfies SessionPayload)

  return `${payload}.${sign(payload)}`
}

export function verifySessionToken(token?: string) {
  if (!token) return null

  const [payload, signature] = token.split('.')
  if (!payload || !signature || !safeEqual(sign(payload), signature)) return null

  const session = decodePayload(payload)
  if (!session || session.exp < Math.floor(Date.now() / 1000)) return null

  return session
}

const getUserForSessionToken = cache(async (token?: string) => {
  const session = verifySessionToken(token)
  if (!session) return null

  return prisma.user.findUnique({
    where: {
      id: session.userId,
    },
  })
})

export async function getCurrentUser() {
  const cookieStore = await cookies()
  return getUserForSessionToken(cookieStore.get(SESSION_COOKIE)?.value)
}

export async function getCurrentAdminUser() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') return null

  return user
}

export async function requireAdminUser(nextPath = '/admin') {
  const user = await getCurrentUser()

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`)
  }

  if (user.role !== 'admin') {
    redirect('/account')
  }

  return user
}

export async function assertAdminUser() {
  const user = await getCurrentAdminUser()

  if (!user) {
    throw new Error('Admin authentication required')
  }

  return user
}

export async function setAuthCookie(user: Pick<User, 'id' | 'email'>) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, createSessionToken(user), {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export function getSafeRedirectPath(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return '/account'
  }

  return value
}
