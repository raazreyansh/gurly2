import { supabase } from "@/lib/supabase/client"
import { withSupabaseTimeout } from "@/lib/supabase/timeout"

export async function validateCoupon(code: string) {
  const result = await withSupabaseTimeout(supabase
    .from("coupons")
    .select()
    .eq("code", code.toUpperCase())
    .single())
  return result?.data ?? null
}
