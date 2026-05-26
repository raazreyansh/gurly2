import { supabase } from "@/lib/supabase/client"
import { withSupabaseTimeout } from "@/lib/supabase/timeout"
import { MOCK_PRODUCTS } from "@/services/mock-products"
import type { Product } from "@/types/database"

export async function getAdminProducts() {
  try {
    const result = await withSupabaseTimeout(supabase
      .from("products")
      .select("*, categories(name, slug)")
      .order("created_at", { ascending: false }))
    const data = result?.data
    const error = result?.error

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS
    }
    return data as Product[] | null
  } catch {
    return MOCK_PRODUCTS
  }
}

export async function getAdminProductById(id: string) {
  try {
    const result = await withSupabaseTimeout(supabase
      .from("products")
      .select("*, categories(name, slug)")
      .eq("id", id)
      .single())
    const data = result?.data
    const error = result?.error

    if (error || !data) {
      return MOCK_PRODUCTS.find((product) => product.id === id || product.slug === id) ?? null
    }
    return data as Product | null
  } catch {
    return MOCK_PRODUCTS.find((product) => product.id === id || product.slug === id) ?? null
  }
}

export async function createProduct(product: Partial<Product>) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single()
  return { data, error }
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single()
  return { data, error }
}

export async function deleteProduct(id: string) {
  return supabase.from("products").delete().eq("id", id)
}
