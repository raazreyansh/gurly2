'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { clearAuthCookie, getSafeRedirectPath, setAuthCookie } from '@/lib/auth'

export async function loginCustomer(formData: FormData) {
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const fullName = String(formData.get('name') || '').trim()
  const nextPath = getSafeRedirectPath(formData.get('next'))

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect(`/login?error=Enter%20a%20valid%20email&next=${encodeURIComponent(nextPath)}`)
  }

  const fallbackName = email.split('@')[0]?.replace(/[._-]+/g, ' ') || 'GURLY Customer'

  const user = await prisma.user.upsert({
    where: {
      email,
    },
    create: {
      email,
      fullName: fullName || fallbackName,
      role: 'customer',
    },
    update: fullName
      ? {
          fullName,
        }
      : {},
  })

  await setAuthCookie(user)
  redirect(nextPath)
}

export async function logoutCustomer() {
  await clearAuthCookie()
  redirect('/login')
}
