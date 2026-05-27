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
  return mergeProducts(readLocalProducts(), MOCK_PRODUCTS)
}

async function serverCatalogProducts(fallback: Product[] = MOCK_PRODUCTS) {
  if (typeof window !== "undefined") return fallback

  try {
    const { readServerProducts } = await import("@/services/server-catalog")
    return mergeProducts(await readServerProducts(), fallback)
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
  if (typeof window !== "undefined") {
    return filterCatalogProducts(browserCatalogProducts(), options)
  }

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

    if (error) {
      logUnexpectedSupabaseError("Error fetching products:", error)
      return filterCatalogProducts(await serverCatalogProducts(MOCK_PRODUCTS), options)
    }
    if (!data || data.length === 0) {
      return filterCatalogProducts(await serverCatalogProducts(MOCK_PRODUCTS), options)
    }
    return filterCatalogProducts(await serverCatalogProducts(data as Product[]), options)
  } catch (err) {
    logUnexpectedSupabaseError("Exception fetching products:", err)
    return filterCatalogProducts(await serverCatalogProducts(MOCK_PRODUCTS), options)
  }
}

export async function getProductBySlug(slug: string) {
  if (typeof window !== "undefined") {
    return browserCatalogProducts().find((product) => product.slug === slug || product.id === slug) ?? null
  }

  try {
    const { findServerProduct } = await import("@/services/server-catalog")
    const serverProduct = await findServerProduct(slug)
    if (serverProduct) return serverProduct
  } catch (error) {
    logUnexpectedSupabaseError("Exception reading server fallback product:", error)
  }

  try {
    const result = await withSupabaseTimeout(supabase
      .from("products")
      .select("*, categories(name, slug)")
      .eq("slug", slug)
      .single())
    const data = result?.data
    const error = result?.error

    if (error || !data) {
      return MOCK_PRODUCTS.find((product) => product.slug === slug || product.id === slug) ?? null
    }
    return data as Product | null
  } catch {
    return MOCK_PRODUCTS.find((product) => product.slug === slug || product.id === slug) ?? null
  }
}

export async function searchProducts(term: string) {
  const query = term.trim().toLowerCase()
  if (!query) return []

  if (typeof window !== "undefined") {
    return searchCatalogProducts(browserCatalogProducts(), query)
  }

  try {
    const result = await withSupabaseTimeout(supabase
      .from("products")
      .select("*, categories(name, slug)")
      .ilike("title", `%${query}%`))
    const data = result?.data
    const error = result?.error

    if (!error && data && data.length > 0) {
      return searchCatalogProducts(await serverCatalogProducts(data as Product[]), query)
    }
    return searchCatalogProducts(await serverCatalogProducts(MOCK_PRODUCTS), query)
  } catch {
    return searchCatalogProducts(await serverCatalogProducts(MOCK_PRODUCTS), query)
  }
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
