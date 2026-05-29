'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

type GoogleAuthCallbackClientProps = {
  nextPath: string
  oauthError: string
}

export default function GoogleAuthCallbackClient({
  nextPath,
  oauthError,
}: GoogleAuthCallbackClientProps) {
  const router = useRouter()
  const [message, setMessage] = useState(oauthError || 'Securing your GURLY session...')

  useEffect(() => {
    if (oauthError) return

    let cancelled = false

    async function finishGoogleLogin() {
      const { data, error } = await supabase.auth.getSession()

      if (cancelled) return

      if (error || !data.session?.access_token) {
        setMessage(error?.message || 'Google sign in did not return a valid session.')
        return
      }

      const response = await fetch('/api/auth/supabase-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: data.session.access_token,
        }),
      })

      if (cancelled) return

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        setMessage(payload?.error || 'Unable to create secure checkout session.')
        return
      }

      router.replace(nextPath)
    }

    finishGoogleLogin().catch((error) => {
      if (!cancelled) {
        setMessage(error instanceof Error ? error.message : 'Unable to finish Google sign in.')
      }
    })

    return () => {
      cancelled = true
    }
  }, [nextPath, oauthError, router])

  return (
    <section className="max-w-xl rounded-[2rem] border border-[#ead7df] bg-white/80 p-10 shadow-[0_24px_80px_rgba(70,34,52,0.12)] backdrop-blur">
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.35em] text-[#9a6787]">
        Google Authentication
      </p>
      <h1 className="font-serif text-4xl text-[#190a12]">Signing you in</h1>
      <p className="mt-5 text-sm leading-7 text-neutral-600">{message}</p>
    </section>
  )
}
