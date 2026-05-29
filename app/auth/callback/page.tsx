import GoogleAuthCallbackClient from './GoogleAuthCallbackClient'
import { getSafeRedirectPath } from '@/lib/auth'

type AuthCallbackPageProps = {
  searchParams: Promise<{
    next?: string
    error?: string
    error_description?: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function AuthCallbackPage({ searchParams }: AuthCallbackPageProps) {
  const params = await searchParams
  const nextPath = getSafeRedirectPath(params.next)

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf7] px-6 text-center text-black">
      <GoogleAuthCallbackClient
        nextPath={nextPath}
        oauthError={params.error_description || params.error || ''}
      />
    </main>
  )
}
