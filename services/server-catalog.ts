import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import type { Product } from "@/types/database"
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  type ProductDraft,
  slugifyProductTitle,
} from "@/services/local-catalog"

export type { ProductDraft } from "@/services/local-catalog"

const SERVER_PRODUCTS_PATH = path.join(process.cwd(), ".local", "products.json")

function resolveCategory(categoryId?: string | null) {
  return MOCK_CATEGORIES.find((category) => category.id === categoryId) ?? MOCK_CATEGORIES[4]
}

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false

  const product = value as Partial<Product>
  return (
    typeof product.id === "string" &&
    typeof product.title === "string" &&
    typeof product.price === "number" &&
    Array.isArray(product.images)
  )
}

export async function readServerProducts(): Promise<Product[]> {
  try {
    const raw = await readFile(SERVER_PRODUCTS_PATH, "utf8")
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isProduct) : []
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code
    if (code === "ENOENT") {
      try {
        await writeServerProducts(MOCK_PRODUCTS)
        return MOCK_PRODUCTS
      } catch {
        return MOCK_PRODUCTS
      }
    }
    console.error("Failed to read server fallback products:", error)
    return []
  }
}

export async function writeServerProducts(products: Product[]) {
  try {
    await mkdir(path.dirname(SERVER_PRODUCTS_PATH), { recursive: true })
    await writeFile(SERVER_PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf8")
  } catch (error) {
    console.warn("Failed to write to local server catalogue (expected on read-only platforms like Vercel):", error)
  }
}

export async function findServerProduct(idOrSlug: string) {
  const products = await readServerProducts()
  return products.find((product) => product.id === idOrSlug || product.slug === idOrSlug) ?? null
}

export async function deleteServerProduct(id: string) {
  try {
    const products = await readServerProducts()
    const next = products.filter((item) => item.id !== id)
    await writeServerProducts(next)
  } catch (error) {
    console.error("Failed to delete server product:", error)
  }
}

export async function saveServerProduct(draft: ProductDraft, existingProduct?: Product | null) {
  const existing = existingProduct ?? null
  const slug = slugifyProductTitle(draft.slug || existing?.slug || draft.title)
  const category = resolveCategory(draft.category_id ?? existing?.category_id)
  const product: Product = {
    id: draft.id || existing?.id || `server-${slug}-${Date.now()}`,
    title: draft.title || existing?.title || "",
    slug,
    description: draft.description ?? existing?.description ?? null,
    price: draft.price ?? existing?.price ?? 0,
    compare_at_price: draft.compare_at_price ?? existing?.compare_at_price ?? null,
    stock: draft.stock ?? existing?.stock ?? 0,
    images: draft.images?.length ? draft.images : existing?.images ?? ["https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600"],
    featured: draft.featured ?? existing?.featured ?? false,
    category_id: draft.category_id ?? existing?.category_id ?? category.id,
    created_at: existing?.created_at ?? new Date().toISOString(),
    categories: category,
  }

  const products = await readServerProducts()
  const next = [
    product,
    ...products.filter((item) => item.id !== product.id && item.slug !== product.slug),
  ]
  await writeServerProducts(next)
  return product
}
