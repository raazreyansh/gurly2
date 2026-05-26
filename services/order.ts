import { supabase } from "@/lib/supabase/client"

export async function createOrder(total: number, userId?: string) {
  const { data, error } = await supabase
    .from("orders")
    .insert({ total, status: "pending", user_id: userId })
    .select()
    .single()
  return { data, error }
}

export async function getOrders() {
  const { data } = await supabase
    .from("orders")
    .select("*, shipments(*), payments(*)")
    .order("created_at", { ascending: false })
  return data
}

export async function getOrderById(id: string) {
  const { data } = await supabase
    .from("orders")
    .select("*, shipments(*), payments(*), order_items(*)")
    .eq("id", id)
    .single()
  return data
}
