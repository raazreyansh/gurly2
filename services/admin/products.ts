import { supabase } from "@/lib/supabase/client"
import { withSupabaseTimeout } from "@/lib/supabase/timeout"
import { mergeProducts, readLocalProducts, saveLocalProduct } from "@/services/local-catalog"
import { logUnexpectedSupabaseError } from "@/services/supabase-errors"
import type { Product } from "@/types/database"

function findFallbackProduct(id: string) {
  return readLocalProducts().find((product) => product.id === id || product.slug === id) ?? null
}

async function serverFallbackProducts(fallback: Product[] = []) {
  if (typeof window !== "undefined") return fallback

  try {
    const { readServerProducts } = await import("@/services/server-catalog")
    const serverProducts = await readServerProducts()
    if (serverProducts.length > 0) {
      return serverProducts
    }
    return fallback
  } catch (error) {
    logUnexpectedSupabaseError("Exception reading server fallback admin products:", error)
    return fallback
  }
}

async function findServerFallbackProduct(id: string) {
  if (typeof window !== "undefined") return findFallbackProduct(id)

  try {
    const { findServerProduct } = await import("@/services/server-catalog")
    return await findServerProduct(id) ?? findFallbackProduct(id)
  } catch (error) {
    logUnexpectedSupabaseError("Exception reading server fallback admin product:", error)
    return findFallbackProduct(id)
  }
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
  const fallbackProducts = await serverFallbackProducts([])

  try {
    const result = await withSupabaseTimeout(supabase
      .from("products")
      .select("*, categories(name, slug)")
      .order("created_at", { ascending: false }))
    const data = result?.data
    const error = result?.error

    if (error) {
      logUnexpectedSupabaseError("Error fetching admin products:", error)
      return fallbackProducts
    }
    return data?.length ? mergeProducts(fallbackProducts, data as Product[]) : fallbackProducts
  } catch (err) {
    logUnexpectedSupabaseError("Exception fetching admin products:", err)
    return fallbackProducts
  }
}

export async function getAdminProductById(id: string) {
  const fallbackProduct = await findServerFallbackProduct(id)
  if (fallbackProduct) {
    return fallbackProduct
  }

  try {
    const result = await withSupabaseTimeout(supabase
      .from("products")
      .select("*, categories(name, slug)")
      .eq("id", id)
      .single())
    const data = result?.data
    const error = result?.error

    if (error || !data) {
      return null
    }
    return data as Product | null
  } catch {
    return null
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
  // 1. Delete from Supabase Database
  const result = await supabase.from("products").delete().eq("id", id)

  // 2. Delete from browser Local Storage
  if (typeof window !== "undefined") {
    try {
      const { readLocalProducts, writeLocalProducts } = await import("@/services/local-catalog")
      const existing = readLocalProducts()
      const next = existing.filter((item) => item.id !== id)
      writeLocalProducts(next)
    } catch (e) {
      console.error("Local catalog deletion failed:", e)
    }
  }

  // 3. Delete from server-side fallback files
  try {
    const { deleteServerProduct } = await import("@/services/server-catalog")
    await deleteServerProduct(id)
  } catch {
    // Fail silently in browser context where filesystem is inaccessible
  }

  return result
}
