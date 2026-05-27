import type { Category, Product } from "@/types/database"

export const LOCAL_PRODUCTS_KEY = "gurly_local_products"
export const LOCAL_PRODUCTS_EVENT = "gurly_products_change"

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Earrings", slug: "earrings", image_url: null },
  { id: "cat-2", name: "Necklaces", slug: "necklaces", image_url: null },
  { id: "cat-3", name: "Bracelets", slug: "bracelets", image_url: null },
  { id: "cat-4", name: "Rings", slug: "rings", image_url: null },
  { id: "cat-5", name: "Accessories", slug: "accessories", image_url: null },
]

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    title: "Gold Hoop Earrings",
    slug: "gold-hoop-earrings",
    description: "Classic gold hoop earrings for everyday catalogue display.",
    price: 899,
    compare_at_price: 1299,
    stock: 24,
    images: ["https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600"],
    featured: true,
    category_id: "cat-1",
    created_at: "2025-01-01T00:00:00.000Z",
    categories: MOCK_CATEGORIES[0],
  },
  {
    id: "prod-2",
    title: "Minimalist Silver Bracelet",
    slug: "minimalist-silver-bracelet",
    description: "Slim silver bracelet with a polished everyday finish.",
    price: 799,
    compare_at_price: 1099,
    stock: 18,
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600"],
    featured: true,
    category_id: "cat-3",
    created_at: "2025-01-02T00:00:00.000Z",
    categories: MOCK_CATEGORIES[2],
  },
  {
    id: "prod-3",
    title: "Pearl Pendant Necklace",
    slug: "pearl-pendant-necklace",
    description: "Freshwater pearl pendant on a delicate gold chain.",
    price: 2299,
    compare_at_price: 2999,
    stock: 12,
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600"],
    featured: true,
    category_id: "cat-2",
    created_at: "2025-01-03T00:00:00.000Z",
    categories: MOCK_CATEGORIES[1],
  },
]

export type ProductDraft = {
  id?: string
  title: string
  slug?: string | null
  description?: string | null
  price: number
  compare_at_price?: number | null
  stock?: number
  images?: string[]
  featured?: boolean
  category_id?: string | null
}

export function slugifyProductTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function readLocalProducts() {
  if (typeof window === "undefined") return []

  try {
    const raw = window.localStorage.getItem(LOCAL_PRODUCTS_KEY)
    if (!raw) {
      writeLocalProducts(MOCK_PRODUCTS)
      return MOCK_PRODUCTS
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Product[]) : []
  } catch {
    return []
  }
}

export function writeLocalProducts(products: Product[]) {
  if (typeof window === "undefined") return

  window.localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products))
  window.dispatchEvent(new Event(LOCAL_PRODUCTS_EVENT))
}

export function saveLocalProduct(draft: ProductDraft) {
  const now = new Date().toISOString()
  const slug = slugifyProductTitle(draft.slug || draft.title)
  const product: Product = {
    id: draft.id || `local-${slug}-${Date.now()}`,
    title: draft.title,
    slug,
    description: draft.description ?? null,
    price: draft.price,
    compare_at_price: draft.compare_at_price ?? null,
    stock: draft.stock ?? 0,
    images: draft.images?.length
      ? draft.images
      : ["https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600"],
    featured: Boolean(draft.featured),
    category_id: draft.category_id ?? "cat-5",
    created_at: now,
    categories: MOCK_CATEGORIES[4],
  }

  const existing = readLocalProducts()
  const next = [
    product,
    ...existing.filter((item) => item.id !== product.id && item.slug !== product.slug),
  ]
  writeLocalProducts(next)
  return product
}

export function mergeProducts(primary: Product[], fallback: Product[] = []) {
  const seen = new Set<string>()
  const merged: Product[] = []

  for (const product of [...primary, ...fallback]) {
    const key = product.slug || product.id
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(product)
  }

  return merged
}

export function filterCatalogProducts(products: Product[], options?: {
  featured?: boolean
  categorySlug?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
}) {
  let list = products
  const categorySlug = options?.categorySlug
  const minPrice = options?.minPrice
  const maxPrice = options?.maxPrice

  if (options?.featured) list = list.filter((product) => product.featured)
  if (categorySlug) list = list.filter((product) => product.categories?.slug === categorySlug)
  if (typeof minPrice === "number") list = list.filter((product) => product.price >= minPrice)
  if (typeof maxPrice === "number") list = list.filter((product) => product.price <= maxPrice)
  if (options?.limit) list = list.slice(0, options.limit)

  return list
}

export function searchCatalogProducts(products: Product[], query: string) {
  const cleanQuery = query.trim().toLowerCase()
  if (!cleanQuery) return []

  return products.filter((product) => {
    const fields = [
      product.title,
      product.description ?? "",
      product.categories?.name ?? "",
      product.categories?.slug ?? "",
    ].map((value) => value.toLowerCase())

    return fields.some((value) => value.includes(cleanQuery))
  })
}
