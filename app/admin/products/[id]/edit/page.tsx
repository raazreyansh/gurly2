import { getAdminProductById } from "@/services/admin/products"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { EditProductForm } from "./EditProductForm"

export const metadata = { title: "Edit Product" }

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getAdminProductById(id)

  if (!product) notFound()

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ marginBottom: "32px" }}>
        <Link href="/admin/products" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>
          <ArrowLeft size={14} /> Back to Products
        </Link>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500" }}>Edit Product</h1>
        <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>{product.title}</p>
      </div>

      <EditProductForm product={product} />
    </div>
  )
}
