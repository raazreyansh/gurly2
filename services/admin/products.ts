import { supabase } from "@/lib/supabase/client"
import { withSupabaseTimeout } from "@/lib/supabase/timeout"
import { Product } from "@/types/database"

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
    category_id: null,
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
    category_id: null,
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600"],
    created_at: "2026-05-26T00:00:00Z"
  }
]

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
