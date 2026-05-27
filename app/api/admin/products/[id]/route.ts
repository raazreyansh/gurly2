import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server-client"
import { MOCK_PRODUCTS, type ProductDraft } from "@/services/local-catalog"
import { findServerProduct, saveServerProduct } from "@/services/server-catalog"
import type { Product } from "@/types/database"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function normalizeProductUpdate(body: unknown, id: string, existing?: Product | null): ProductDraft | null {
  if (!body || typeof body !== "object") return null

  const product = body as Record<string, unknown>
  const title = typeof product.title === "string" ? product.title : existing?.title
  const price = typeof product.price === "number" ? product.price : existing?.price

  if (!title || typeof price !== "number") return null

  return {
    id,
    title,
    slug: typeof product.slug === "string" ? product.slug : existing?.slug,
    description: typeof product.description === "string" ? product.description : existing?.description ?? null,
    price,
    compare_at_price: typeof product.compare_at_price === "number" ? product.compare_at_price : existing?.compare_at_price ?? null,
    stock: typeof product.stock === "number" ? product.stock : existing?.stock ?? 0,
    images: Array.isArray(product.images) ? product.images.filter((image): image is string => typeof image === "string") : existing?.images ?? [],
    featured: typeof product.featured === "boolean" ? product.featured : existing?.featured ?? false,
    category_id: typeof product.category_id === "string" ? product.category_id : existing?.category_id ?? null,
  }
}

function findMockProduct(idOrSlug: string) {
  return MOCK_PRODUCTS.find((product) => product.id === idOrSlug || product.slug === idOrSlug) ?? null
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const body = await req.json()
  const update = normalizeProductUpdate(body, id)

  if (!update) {
    return NextResponse.json({ error: "Missing required product fields." }, { status: 400 })
  }

  let supabaseErrorMessage: string | null = null

  if (!supabaseAdmin) {
    console.error("Supabase admin client unavailable in update route; falling back to server catalogue.")
  } else {
    const supabaseUpdate: Partial<ProductDraft> = { ...update }
    delete supabaseUpdate.id
    const { data, error } = await supabaseAdmin
      .from("products")
      .update(supabaseUpdate)
      .eq("id", id)
      .select()
      .single()

    if (!error && data) {
      return NextResponse.json({ data })
    }

    supabaseErrorMessage = error?.message ?? "Unknown Supabase admin error"
    console.error("Supabase admin update failed:", error)
  }

  try {
    const existing = await findServerProduct(id) ?? findMockProduct(id)
    const fallbackUpdate = normalizeProductUpdate(body, id, existing)
    if (!fallbackUpdate) {
      return NextResponse.json({ error: "Missing required product fields." }, { status: 400 })
    }

    const data = await saveServerProduct(fallbackUpdate, existing)
    return NextResponse.json({ data, fallback: true, supabaseError: supabaseErrorMessage })
  } catch (error) {
    console.error("Failed to update product in server fallback catalogue:", error)
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 })
  }
}
