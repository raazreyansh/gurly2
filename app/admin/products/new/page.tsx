"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProductImageUploader } from "@/components/admin/ProductImageUploader"
import { createProduct } from "@/services/admin/products"

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

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { stock: 0, featured: false },
  })

  const titleRegister = register("title")

  async function onSubmit(formData: ProductForm) {
    setLoading(true)
    try {
      const { data, error } = await createProduct({
        ...formData,
        images: imageUrls,
      })

      if (error || !data) {
        throw error || new Error("Product creation failed")
      }

      toast.success("Product created!")
      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.warn("Product creation failed; falling back to local store:", error)
      toast.error("Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ marginBottom: "32px" }}>
        <Link href="/admin/products" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>
          <ArrowLeft size={14} /> Back to Products
        </Link>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500" }}>New Product</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "grid", gap: "24px" }} className="lg:grid-cols-3">
          <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "20px" }}>Product Information</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Title *</label>
                  <input
                    {...titleRegister}
                    id="product-title"
                    className="input"
                    placeholder="Gold Hoop Earrings"
                    onChange={(event) => {
                      titleRegister.onChange(event)
                      setValue("slug", event.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))
                    }}
                  />
                  {errors.title && <p style={{ fontSize: "11px", color: "var(--rose)", marginTop: "4px" }}>{errors.title.message}</p>}
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Slug *</label>
                  <input {...register("slug")} id="product-slug" className="input" placeholder="gold-hoop-earrings" />
                  {errors.slug && <p style={{ fontSize: "11px", color: "var(--rose)", marginTop: "4px" }}>{errors.slug.message}</p>}
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Description</label>
                  <textarea
                    {...register("description")}
                    id="product-description"
                    placeholder="Describe the product..."
                    rows={4}
                    style={{ width: "100%", padding: "12px 16px", background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: "2px", fontSize: "14px", fontFamily: "var(--font-sans)", resize: "vertical", outline: "none" }}
                  />
                </div>
              </div>
            </div>

            <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "20px" }}>Pricing</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Price (₹) *</label>
                  <input {...register("price", { valueAsNumber: true })} id="product-price" type="number" className="input" placeholder="999" />
                  {errors.price && <p style={{ fontSize: "11px", color: "var(--rose)", marginTop: "4px" }}>{errors.price.message}</p>}
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Compare Price (₹)</label>
                  <input
                    {...register("compare_at_price", { setValueAs: (value) => value === "" ? undefined : Number(value) })}
                    id="product-compare-price"
                    type="number"
                    className="input"
                    placeholder="1299"
                  />
                </div>
              </div>
            </div>

            <ProductImageUploader value={imageUrls} onChange={setImageUrls} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "20px" }}>Publish</h2>
              <button type="submit" id="publish-product-btn" disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>
                {loading ? "Publishing..." : "Publish Product"}
              </button>
              <Link href="/admin/products" className="btn btn-outline" style={{ width: "100%", marginTop: "8px" }}>
                Cancel
              </Link>
            </div>

            <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "20px" }}>Inventory</h2>
              <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Stock Quantity</label>
              <input {...register("stock", { valueAsNumber: true })} id="product-stock" type="number" className="input" min="0" placeholder="0" />
            </div>

            <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "20px" }}>Options</h2>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input {...register("featured")} id="product-featured" type="checkbox" style={{ width: "16px", height: "16px", accentColor: "var(--rose)" }} />
                <span style={{ fontSize: "13px", color: "var(--charcoal-light)" }}>Featured product</span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
