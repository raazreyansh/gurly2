import { supabase } from "@/lib/supabase/client"
import { withSupabaseTimeout } from "@/lib/supabase/timeout"
import { Product } from "@/types/database"

const MOCK_CATEGORIES = [
  { id: "cat-1", name: "Earrings", slug: "earrings", image_url: null },
  { id: "cat-2", name: "Necklaces", slug: "necklaces", image_url: null },
  { id: "cat-3", name: "Bracelets", slug: "bracelets", image_url: null },
  { id: "cat-4", name: "Rings", slug: "rings", image_url: null },
  { id: "cat-5", name: "Accessories", slug: "accessories", image_url: null }
]

const MOCK_PRODUCTS: Product[] = []

export async function getProducts(options?: {
  featured?: boolean
  categorySlug?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
}) {
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
      let list = MOCK_PRODUCTS
      if (options?.featured) list = list.filter(p => p.featured)
      if (options?.categorySlug) list = list.filter(p => p.categories?.slug === options.categorySlug)
      if (typeof options?.minPrice === "number") list = list.filter(p => p.price >= options.minPrice!)
      if (typeof options?.maxPrice === "number") list = list.filter(p => p.price <= options.maxPrice!)
      if (options?.limit) list = list.slice(0, options.limit)
      return list
    }
    return data as Product[] | null
  } catch {
    let list = MOCK_PRODUCTS
    if (options?.featured) list = list.filter(p => p.featured)
    if (options?.categorySlug) list = list.filter(p => p.categories?.slug === options.categorySlug)
    if (typeof options?.minPrice === "number") list = list.filter(p => p.price >= options.minPrice!)
    if (typeof options?.maxPrice === "number") list = list.filter(p => p.price <= options.maxPrice!)
    if (options?.limit) list = list.slice(0, options.limit)
    return list
  }
}

export async function getProductBySlug(slug: string) {
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
