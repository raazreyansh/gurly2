import { supabase } from "@/lib/supabase/client"
import { withSupabaseTimeout } from "@/lib/supabase/timeout"
import { Product } from "@/types/database"
import { MOCK_CATEGORIES, MOCK_PRODUCTS, filterMockProducts } from "@/services/mock-products"

function shouldUseLocalBrowserCatalog() {
  if (typeof window === "undefined") return false

  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)
}

export async function getProducts(options?: {
  featured?: boolean
  categorySlug?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
}) {
  if (shouldUseLocalBrowserCatalog()) {
    return filterMockProducts(options)
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

    if (error || !data || data.length === 0) {
      return filterMockProducts(options)
    }
    return data as Product[] | null
  } catch {
    return filterMockProducts(options)
  }
}

export async function getProductBySlug(slug: string) {
  if (shouldUseLocalBrowserCatalog()) {
    return MOCK_PRODUCTS.find(p => p.slug === slug) || null
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
      return MOCK_PRODUCTS.find(p => p.slug === slug) || null
    }
    return data as Product | null
  } catch {
    return MOCK_PRODUCTS.find(p => p.slug === slug) || null
  }
}

export async function searchProducts(term: string) {
  const query = term.trim().toLowerCase()
  if (!query) return []

  if (shouldUseLocalBrowserCatalog()) {
    return searchMockProducts(query)
  }

  try {
    const result = await withSupabaseTimeout(supabase
      .from("products")
      .select("*, categories(name, slug)")
      .ilike("title", `%${query}%`))
    const data = result?.data
    const error = result?.error

    if (!error && data && data.length > 0) {
      return data as Product[]
    }
  } catch {
    // Fall through to mock data for local development.
  }

  return searchMockProducts(query)
}

function searchMockProducts(query: string) {
  return MOCK_PRODUCTS.filter((product) => {
    const fields = [
      product.title,
      product.description ?? "",
      product.categories?.name ?? "",
      product.categories?.slug ?? "",
    ].map((value) => value.toLowerCase())

    return fields.some((value) => value.includes(query))
  })
}

export async function getCategories() {
  try {
    const result = await withSupabaseTimeout(supabase
      .from("categories")
      .select())
    const data = result?.data
    const error = result?.error

    if (error || !data || data.length === 0) {
      return MOCK_CATEGORIES
    }
    return data
  } catch {
    return MOCK_CATEGORIES
  }
}
