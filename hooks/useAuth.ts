"use client"

import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase/client"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    function checkAuth() {
      // Check local storage fallback first
      const localUser = localStorage.getItem("gurly_customer_user")
      if (localUser) {
        try {
          setUser(JSON.parse(localUser))
          setLoading(false)
          return
        } catch {}
      }

      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
        setLoading(false)
      })
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        // Fallback check
        const localUser = localStorage.getItem("gurly_customer_user")
        if (localUser) {
          try {
            setUser(JSON.parse(localUser))
          } catch {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      }
      setLoading(false)
    })

    // Listen to local login updates
    window.addEventListener("storage", checkAuth)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  return { user, loading }
}
