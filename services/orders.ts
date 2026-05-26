import { supabase } from "@/lib/supabase/client"
import { withSupabaseTimeout } from "@/lib/supabase/timeout"

export async function getOrders() {
  const result = await withSupabaseTimeout(supabase
    .from("orders")
    .select("*, shipments(*), payments(*)")
    .order("created_at", { ascending: false }))
  return result?.data ?? []
}

export async function getOrderById(id: string) {
  const result = await withSupabaseTimeout(supabase
    .from("orders")
    .select("*, shipments(*), payments(*), order_items(*)")
    .eq("id", id)
    .single())
  return result?.data ?? null
}
