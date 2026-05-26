import { supabase } from "@/lib/supabase/client"
import { withSupabaseTimeout } from "@/lib/supabase/timeout"
import { MOCK_PRODUCTS, readLocalProducts, saveLocalProduct } from "@/services/local-catalog"
import { logUnexpectedSupabaseError } from "@/services/supabase-errors"
import type { Product } from "@/types/database"

function findFallbackProduct(id: string) {
  return [...readLocalProducts(), ...MOCK_PRODUCTS].find((product) => product.id === id || product.slug === id) ?? null
}

function saveFallbackProduct(product: Partial<Product>, existing?: Product | null) {
  if (!product.title && !existing?.title) return null
  if (typeof product.price !== "number" && typeof existing?.price !== "number") return null

  return saveLocalProduct({
    id: product.id ?? existing?.id,
    title: product.title ?? existing?.title ?? "",
    slug: product.slug ?? existing?.slug,
    description: product.description ?? existing?.description ?? null,
    price: product.price ?? existing?.price ?? 0,
    compare_at_price: product.compare_at_price ?? existing?.compare_at_price ?? null,
    stock: product.stock ?? existing?.stock ?? 0,
    images: product.images ?? existing?.images ?? [],
    featured: product.featured ?? existing?.featured ?? false,
    category_id: product.category_id ?? existing?.category_id ?? null,
  })
}

export async function getAdminProducts() {
  try {
    const result = await withSupabaseTimeout(supabase
      .from("products")
      .select("*, categories(name, slug)")
      .order("created_at", { ascending: false }))
    const data = result?.data
    const error = result?.error

    if (error) {
      logUnexpectedSupabaseError("Error fetching admin products:", error)
      return MOCK_PRODUCTS
    }
    return data?.length ? (data as Product[]) : MOCK_PRODUCTS
  } catch (err) {
    logUnexpectedSupabaseError("Exception fetching admin products:", err)
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
      return findFallbackProduct(id)
    }
    return data as Product | null
  } catch {
    return findFallbackProduct(id)
  }
}

export async function createProduct(product: Partial<Product>) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single()
  if (error) {
    const savedProduct = saveFallbackProduct(product)
    if (savedProduct) return { data: savedProduct, error: null }
  }
  return { data, error }
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single()
  if (error) {
    const savedProduct = saveFallbackProduct({ ...updates, id }, findFallbackProduct(id))
    if (savedProduct) return { data: savedProduct, error: null }
  }
  return { data, error }
}

export async function deleteProduct(id: string) {
  return supabase.from("products").delete().eq("id", id)
}
