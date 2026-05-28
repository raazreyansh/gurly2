import { supabase } from "@/lib/supabase/client"
import { withSupabaseTimeout } from "@/lib/supabase/timeout"
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  filterCatalogProducts,
  mergeProducts,
  readLocalProducts,
  searchCatalogProducts,
} from "@/services/local-catalog"
import { logUnexpectedSupabaseError } from "@/services/supabase-errors"
import { Product } from "@/types/database"

function browserCatalogProducts() {
  return readLocalProducts()
}

async function serverCatalogProducts(fallback: Product[] = []) {
  if (typeof window !== "undefined") return fallback

  try {
    const { readServerProducts } = await import("@/services/server-catalog")
    const serverProducts = await readServerProducts()
    if (serverProducts.length > 0) {
      return serverProducts
    }
    return fallback
  } catch (error) {
    logUnexpectedSupabaseError("Exception reading server fallback products:", error)
    return fallback
  }
}

export async function getProducts(options?: {
  featured?: boolean
  categorySlug?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
}) {
  const fallbackProducts = typeof window !== "undefined" ? browserCatalogProducts() : await serverCatalogProducts([])

  try {
    let query = supabase
      .from("products")
      .select("*, categories(name, slug)")
      .order("created_at", { ascending: false })

    if (options?.featured) {
      query = query.eq("featured", true)
    }

    if (options?.categorySlug) {
      query = query.eq("categories.slug", options.categorySlug)
    }

    if (typeof options?.minPrice === "number") {
      query = query.gte("price", options.minPrice)
    }

    if (typeof options?.maxPrice === "number") {
      query = query.lte("price", options.maxPrice)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const result = await withSupabaseTimeout(query)
    const data = result?.data
    const error = result?.error

    if (!error && data && data.length > 0) {
      return filterCatalogProducts(mergeProducts(fallbackProducts, data as Product[]), options)
    }
  } catch (err) {
    logUnexpectedSupabaseError("Exception fetching products from Supabase:", err)
  }

  return filterCatalogProducts(fallbackProducts, options)
}

export async function getProductBySlug(slug: string) {
  const fallbackProducts = typeof window !== "undefined" ? browserCatalogProducts() : await serverCatalogProducts([])
  const fallbackProduct = fallbackProducts.find((product) => product.slug === slug || product.id === slug)

  if (fallbackProduct) {
    return fallbackProduct
  }

  try {
    const result = await withSupabaseTimeout(supabase
      .from("products")
      .select("*, categories(name, slug)")
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .maybeSingle())
    const data = result?.data

    if (data) {
      return data as Product
    }
  } catch (err) {
    logUnexpectedSupabaseError("Exception fetching single product from Supabase:", err)
  }

  if (typeof window !== "undefined") {
    return null
  }

  try {
    const { findServerProduct } = await import("@/services/server-catalog")
    const serverProduct = await findServerProduct(slug)
    if (serverProduct) return serverProduct
  } catch (error) {
    logUnexpectedSupabaseError("Exception reading server fallback product:", error)
  }

  return MOCK_PRODUCTS.find((product) => product.slug === slug || product.id === slug) ?? null
}

export async function searchProducts(term: string) {
  const query = term.trim().toLowerCase()
  if (!query) return []

  const fallbackProducts = typeof window !== "undefined" ? browserCatalogProducts() : await serverCatalogProducts([])

  try {
    const result = await withSupabaseTimeout(supabase
      .from("products")
      .select("*, categories(name, slug)")
      .ilike("title", `%${query}%`))
    const data = result?.data

    if (data && data.length > 0) {
      return searchCatalogProducts(mergeProducts(fallbackProducts, data as Product[]), query)
    }
  } catch (err) {
    logUnexpectedSupabaseError("Exception searching products in Supabase:", err)
  }

  return searchCatalogProducts(fallbackProducts.length > 0 ? fallbackProducts : MOCK_PRODUCTS, query)
}

export async function getCategories() {
  try {
    const result = await withSupabaseTimeout(supabase
      .from("categories")
      .select())
    const data = result?.data
    const error = result?.error

    if (error) {
      return MOCK_CATEGORIES
    }
    return data?.length ? data : MOCK_CATEGORIES
  } catch {
    return MOCK_CATEGORIES
  }
}
