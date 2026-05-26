import { supabase } from "@/lib/supabase/client"

export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/account` : undefined
    }
  })
  return { data, error }
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getProfile(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select()
    .eq("id", userId)
    .single()
  return data
}
