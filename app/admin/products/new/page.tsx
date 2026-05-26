"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Trash2, Loader2, Link as LinkIcon, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

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
  const [uploadMode, setUploadMode] = useState<"upload" | "url">("upload")
  const [uploading, setUploading] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)
  const [urlInput, setUrlInput] = useState("")

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { stock: 0, featured: false },
  })

  const processFiles = async (files: FileList | File[]) => {
    const list = Array.from(files)
    if (imageUrls.length + list.length > 10) {
      toast.error("You can upload a maximum of 10 images.")
      return
    }

    setUploading(true)
    let successCount = 0
    
    for (const file of list) {
      const extension = file.name.split('.').pop()?.toLowerCase()
      const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif", "svg", "heic"]
      
      if (!file.type.startsWith("image/") && !allowedExtensions.includes(extension || "")) {
        toast.error(`File ${file.name} is not a valid image format.`)
        continue
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 10MB limit.`)
        continue
      }

      try {
        const { supabase } = await import("@/lib/supabase/client")
        const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")

        if (isPlaceholder) {
          throw new Error("Placeholder Supabase connection")
        }

        const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${extension}`
        const filePath = `products/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath)

        setImageUrls(prev => [...prev, publicUrl])
        successCount++
      } catch (err) {
        console.log("Supabase storage upload failed, preparing local Base64 URL:", err)
        // Fallback base64
        const reader = new FileReader()
        reader.onloadend = () => {
          setImageUrls(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
        successCount++
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully loaded ${successCount} images!`)
    }
    setUploading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files)
  }

  const addUrlImage = () => {
    if (!urlInput) return
    if (!urlInput.startsWith("http://") && !urlInput.startsWith("https://")) {
      toast.error("Please enter a valid HTTP/HTTPS URL")
      return
    }
    setImageUrls(prev => [...prev, urlInput])
    setUrlInput("")
    toast.success("Image URL added!")
  }

  async function onSubmit(data: ProductForm) {
    setLoading(true)
    try {
      const { supabase } = await import("@/lib/supabase/client")
      const { error } = await supabase.from("products").insert({
        ...data,
        images: imageUrls,
      })
      if (error) throw error
      toast.success("Product created!")
      router.push("/admin/products")
    } catch {
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
          {/* Main Fields */}
          <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "20px" }}>Product Information</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>
                    Title *
                  </label>
                  <input
                    {...register("title")}
                    id="product-title"
                    className="input"
                    placeholder="Gold Hoop Earrings"
                    onChange={(e) => {
                      register("title").onChange(e)
                      setValue("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))
                    }}
                  />
                  {errors.title && <p style={{ fontSize: "11px", color: "var(--rose)", marginTop: "4px" }}>{errors.title.message}</p>}
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>
                    Slug *
                  </label>
                  <input {...register("slug")} id="product-slug" className="input" placeholder="gold-hoop-earrings" />
                  {errors.slug && <p style={{ fontSize: "11px", color: "var(--rose)", marginTop: "4px" }}>{errors.slug.message}</p>}
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    id="product-description"
                    placeholder="Describe the product..."
                    rows={4}
                    style={{
                      width: "100%", padding: "12px 16px", background: "var(--white)",
                      border: "1.5px solid var(--border)", borderRadius: "2px", fontSize: "14px",
                      fontFamily: "var(--font-sans)", resize: "vertical", outline: "none",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
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
                  <input {...register("compare_at_price", { valueAsNumber: true })} id="product-compare-price" type="number" className="input" placeholder="1299" />
                </div>
              </div>
            </div>

            {/* Image */}
            <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "15px", fontWeight: "600", fontFamily: "var(--font-serif)", color: "var(--charcoal)" }}>Product Image</h2>
                <button
                  type="button"
                  onClick={() => setUploadMode(uploadMode === "upload" ? "url" : "upload")}
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "var(--rose)",
                    background: "none",
                    border: "none",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  className="quick-action-hover"
                >
                  {uploadMode === "upload" ? (
                    <>
                      <LinkIcon size={12} /> Paste URL Instead
                    </>
                  ) : (
                    <>
                      <Upload size={12} /> Upload File Instead
                    </>
                  )}
                </button>
              </div>

              {uploadMode === "upload" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    style={{
                      border: isDragActive ? "2px dashed var(--rose)" : "2px dashed var(--border)",
                      background: isDragActive ? "rgba(201,149,108,0.04)" : "rgba(253,246,238,0.3)",
                      borderRadius: "8px",
                      padding: "36px 20px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    className="quick-action-hover"
                    onClick={() => document.getElementById("file-upload-input")?.click()}
                  >
                    <input
                      type="file"
                      id="file-upload-input"
                      accept="image/*,.jpeg,.jpg,.png,.webp,.svg"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    
                    {uploading ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                        <Loader2 size={32} className="animate-spin" style={{ color: "var(--rose)" }} />
                        <p style={{ fontSize: "13px", color: "var(--muted)", fontWeight: "500" }}>Uploading premium images...</p>
                      </div>
                    ) : (
                      <>
                        <div style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background: "rgba(201,149,108,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--rose)",
                          marginBottom: "16px"
                        }}>
                          <Upload size={20} />
                        </div>
                        <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--charcoal)", marginBottom: "4px" }}>
                          Drag & drop multiple images here, or <span style={{ color: "var(--rose)" }}>browse files</span>
                        </p>
                        <p style={{ fontSize: "11px", color: "var(--muted)" }}>
                          Supports JPEG, JPG, PNG, WEBP, or SVG up to 10MB each
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div style={{ position: "relative", flex: 1 }}>
                      <input
                        id="product-image-url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="input"
                        placeholder="https://images.unsplash.com/... (image URL)"
                        style={{ paddingLeft: "40px" }}
                      />
                      <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", display: "flex", alignItems: "center" }}>
                        <ImageIcon size={16} />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addUrlImage}
                      className="btn btn-primary"
                      style={{ padding: "0 20px", borderRadius: "4px", fontSize: "12px", whiteSpace: "nowrap" }}
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              )}

              {/* Multi-Image Gallery preview grid */}
              {imageUrls.length > 0 && (
                <div style={{ marginTop: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <h3 style={{ fontSize: "12px", fontWeight: "700", color: "var(--charcoal)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      Gallery Preview ({imageUrls.length} of 10)
                    </h3>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      background: imageUrls.length >= 5 ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                      color: imageUrls.length >= 5 ? "#10B981" : "#F59E0B"
                    }}>
                      {imageUrls.length >= 5 ? "✓ Complete (At least 5 listed)" : `⚡ Upload ${5 - imageUrls.length} more for optimal luxury carousel`}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }} className="md:grid-cols-5">
                    {imageUrls.map((url, idx) => (
                      <div
                        key={url + idx}
                        style={{
                          position: "relative",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px solid var(--border)",
                          background: "var(--cream-dark)",
                          aspectRatio: "1/1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <img
                          src={url}
                          alt={`Preview ${idx + 1}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div style={{
                          position: "absolute",
                          bottom: "6px",
                          left: "6px",
                          background: "rgba(15,23,42,0.75)",
                          color: "white",
                          fontSize: "9px",
                          fontWeight: "700",
                          padding: "2px 6px",
                          borderRadius: "4px"
                        }}>
                          {idx === 0 ? "Cover" : `#${idx + 1}`}
                        </div>
                        <button
                          type="button"
                          onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== idx))}
                          style={{
                            position: "absolute",
                            top: "6px",
                            right: "6px",
                            background: "rgba(255,255,255,0.9)",
                            border: "none",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#EF4444",
                            cursor: "pointer",
                            boxShadow: "var(--shadow-sm)",
                            transition: "all 0.2s"
                          }}
                          title="Remove image"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Publish */}
            <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "20px" }}>Publish</h2>
              <button
                type="submit"
                id="publish-product-btn"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                {loading ? "Publishing..." : "Publish Product"}
              </button>
              <Link href="/admin/products" className="btn btn-outline" style={{ width: "100%", marginTop: "8px" }}>
                Cancel
              </Link>
            </div>

            {/* Inventory */}
            <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "20px" }}>Inventory</h2>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Stock Quantity</label>
                <input {...register("stock", { valueAsNumber: true })} id="product-stock" type="number" className="input" min="0" placeholder="0" />
              </div>
            </div>

            {/* Options */}
            <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "20px" }}>Options</h2>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input
                  {...register("featured")}
                  id="product-featured"
                  type="checkbox"
                  style={{ width: "16px", height: "16px", accentColor: "var(--rose)" }}
                />
                <span style={{ fontSize: "13px", color: "var(--charcoal-light)" }}>Featured product</span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
