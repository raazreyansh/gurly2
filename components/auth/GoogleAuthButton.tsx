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
      setError(signInError.message)
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
        <p className="rounded-full bg-red-50 px-5 py-3 text-xs font-semibold text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}
