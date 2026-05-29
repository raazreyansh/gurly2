'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type GoogleAuthButtonProps = {
  nextPath: string
}

export default function GoogleAuthButton({ nextPath }: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')

    const origin = window.location.origin
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`

    const statusResponse = await fetch('/api/auth/google-status', {
      cache: 'no-store',
    })
    const statusPayload = await statusResponse.json().catch(() => null)

    if (!statusResponse.ok || !statusPayload?.enabled) {
      setError(
        statusPayload?.error ||
          'Google sign in is not enabled in Supabase yet. Use email login for now.',
      )
      setLoading(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    })

    if (signInError) {
      setError(`${signInError.message}. Use email login for now.`)
      setLoading(false)
    }
  }

  return (
    <div className="mt-10 space-y-3">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-[#ead7df] bg-white px-6 py-4 text-xs font-bold uppercase tracking-[0.22em] text-[#190a12] shadow-sm transition hover:border-[#7b4867] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-black normal-case tracking-normal text-[#4285f4]">
          G
        </span>
        {loading ? 'Opening Google...' : 'Continue with Google'}
      </button>

      {error ? (
        <p className="rounded-2xl bg-amber-50 px-5 py-4 text-xs font-semibold leading-5 text-amber-800">
          Google login is not active yet. {error}
        </p>
      ) : null}
    </div>
  )
}
