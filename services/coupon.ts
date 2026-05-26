import { supabase } from "@/lib/supabase/client"
import { withSupabaseTimeout } from "@/lib/supabase/timeout"

export async function validateCoupon(code: string) {
  const cleanCode = code.toUpperCase()
  if (cleanCode === "LAUNCH30" || cleanCode === "LAUNCH") {
    return {
      code: cleanCode,
      type: "percent",
      value: 30,
      min_order: 0
    }
  }

  const result = await withSupabaseTimeout(supabase
    .from("coupons")
    .select()
    .eq("code", cleanCode)
    .single())
  return result?.data ?? null
}
