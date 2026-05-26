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

const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    title: "Gold Hoop Earrings",
    slug: "gold-hoop-earrings",
    description: "Classic 14k gold-plated hoops. Lightweight, hypoallergenic, and perfect for daily wear.",
    price: 899,
    compare_at_price: 1299,
    stock: 25,
    featured: true,
    category_id: "cat-1",
    categories: MOCK_CATEGORIES[0],
    images: ["https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600"],
    created_at: "2026-05-26T00:00:00Z"
  },
  {
    id: "prod-2",
    title: "Pearl Pendant Necklace",
    slug: "pearl-pendant-necklace",
    description: "A stunning freshwater pearl suspended on a delicate sterling silver chain.",
    price: 1499,
    compare_at_price: 1999,
    stock: 12,
    featured: true,
    category_id: "cat-2",
    categories: MOCK_CATEGORIES[1],
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600"],
    created_at: "2026-05-26T00:00:00Z"
  },
  {
    id: "prod-3",
    title: "Minimalist Silver Bracelet",
    slug: "minimalist-silver-bracelet",
    description: "Sleek and polished sterling silver chain bracelet with a secure lobster clasp.",
    price: 699,
    compare_at_price: 999,
    stock: 40,
    featured: true,
    category_id: "cat-3",
    categories: MOCK_CATEGORIES[2],
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600"],
    created_at: "2026-05-26T00:00:00Z"
  },
  {
    id: "prod-4",
    title: "Rose Gold Stacking Ring",
    slug: "rose-gold-stacking-ring",
    description: "A gorgeous rose gold band featuring micro-pave crystals for subtle sparkle.",
    price: 1199,
    compare_at_price: 1599,
    stock: 18,
    featured: true,
    category_id: "cat-4",
    categories: MOCK_CATEGORIES[3],
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600"],
    created_at: "2026-05-26T00:00:00Z"
  }
]

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
