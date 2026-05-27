import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server-client"
import { saveServerProduct, type ProductDraft } from "@/services/server-catalog"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function normalizeProductPayload(body: unknown): ProductDraft | null {
  if (!body || typeof body !== "object") return null

  const product = body as Record<string, unknown>
  if (
    typeof product.title !== "string" ||
    typeof product.slug !== "string" ||
    typeof product.price !== "number"
  ) {
    return null
  }

  return {
    title: product.title,
    slug: product.slug,
    description: typeof product.description === "string" ? product.description : null,
    price: product.price,
    compare_at_price: typeof product.compare_at_price === "number" ? product.compare_at_price : null,
    stock: typeof product.stock === "number" ? product.stock : 0,
    images: Array.isArray(product.images) ? product.images.filter((image): image is string => typeof image === "string") : [],
    featured: Boolean(product.featured),
    category_id: typeof product.category_id === "string" ? product.category_id : null,
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  const product = normalizeProductPayload(body)

  if (!product) {
    return NextResponse.json({ error: "Missing required product fields." }, { status: 400 })
  }

  let supabaseErrorMessage: string | null = null

  if (!supabaseAdmin) {
    console.error("Supabase admin client unavailable in create route; falling back to server catalogue.")
  } else {
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert(product)
      .select()
      .single()

    if (!error && data) {
      return NextResponse.json({ data })
    }

    supabaseErrorMessage = error?.message ?? "Unknown Supabase admin error"
    console.error("Supabase admin insert failed:", error)
  }

  try {
    const data = await saveServerProduct(product)
    return NextResponse.json({ data, fallback: true, supabaseError: supabaseErrorMessage }, { status: 201 })
  } catch (error) {
    console.error("Failed to save product to server fallback catalogue:", error)
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 })
  }
}
