"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Product } from "@/types/database"
import { updateProduct } from "@/services/admin/products"

const productSchema = z.object({
  title: z.string().min(2, "Title required"),
  slug: z.string().min(2, "Slug required"),
  description: z.string().optional(),
  price: z.number().min(1, "Price required"),
  compare_at_price: z.number().optional(),
  stock: z.number().min(0),
  featured: z.boolean().optional(),
})

type ProductForm = z.infer<typeof productSchema>

export function EditProductForm({ product }: { product: Product }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product.title,
      slug: product.slug ?? product.id,
      description: product.description ?? "",
      price: product.price,
      compare_at_price: product.compare_at_price ?? undefined,
      stock: product.stock,
      featured: product.featured,
    },
  })

  async function onSubmit(data: ProductForm) {
    setLoading(true)
    try {
      const { error } = await updateProduct(product.id, {
        ...data,
        description: data.description || null,
        compare_at_price: data.compare_at_price ?? null,
      })

      if (error) throw error
      toast.success("Product updated")
      router.push("/admin/products")
    } catch {
      toast.error("Failed to update product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "860px" }}>
      <div style={{ display: "grid", gap: "20px" }}>
        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "20px" }}>Product Information</h2>
          <div style={{ display: "grid", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Title *</label>
              <input {...register("title")} id="product-title" className="input" />
              {errors.title && <p style={{ fontSize: "11px", color: "var(--rose)", marginTop: "4px" }}>{errors.title.message}</p>}
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Slug *</label>
              <input {...register("slug")} id="product-slug" className="input" />
              {errors.slug && <p style={{ fontSize: "11px", color: "var(--rose)", marginTop: "4px" }}>{errors.slug.message}</p>}
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Description</label>
              <textarea
                {...register("description")}
                id="product-description"
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "var(--white)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "2px",
                  fontSize: "14px",
                  fontFamily: "var(--font-sans)",
                  resize: "vertical",
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "20px" }}>Pricing and Inventory</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Price (₹) *</label>
              <input {...register("price", { valueAsNumber: true })} id="product-price" type="number" className="input" />
              {errors.price && <p style={{ fontSize: "11px", color: "var(--rose)", marginTop: "4px" }}>{errors.price.message}</p>}
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Compare Price (₹)</label>
              <input
                {...register("compare_at_price", {
                  setValueAs: (value) => value === "" ? undefined : Number(value),
                })}
                id="product-compare-price"
                type="number"
                className="input"
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Stock</label>
              <input {...register("stock", { valueAsNumber: true })} id="product-stock" type="number" min="0" className="input" />
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginTop: "20px" }}>
            <input
              {...register("featured")}
              id="product-featured"
              type="checkbox"
              style={{ width: "16px", height: "16px", accentColor: "var(--rose)" }}
            />
            <span style={{ fontSize: "13px", color: "var(--charcoal-light)" }}>Featured product</span>
          </label>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <Link href="/admin/products" className="btn btn-outline">Cancel</Link>
          <button type="submit" id="save-product-btn" disabled={loading} className="btn btn-primary">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  )
}
