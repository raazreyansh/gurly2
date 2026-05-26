"use client"

import { useState, type ChangeEvent, type DragEvent } from "react"
import { Image as ImageIcon, Link as LinkIcon, Loader2, Trash2, Upload, Wand2 } from "lucide-react"
import { toast } from "sonner"

type ProductImageUploaderProps = {
  value: string[]
  onChange: (urls: string[]) => void
  title?: string
  fileInputId?: string
  urlInputId?: string
  maxImages?: number
  recommendedImages?: number
}

const CATALOGUE_WIDTH = 900
const CATALOGUE_HEIGHT = 1200
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "svg", "heic"])

function fileExtension(file: File) {
  if (file.type === "image/jpeg") return "jpg"
  if (file.type === "image/png") return "png"
  if (file.type === "image/webp") return "webp"
  if (file.type === "image/svg+xml") return "svg"
  if (file.type === "image/gif") return "gif"
  return file.name.split(".").pop()?.toLowerCase() || "jpg"
}

function isSupportedImage(file: File) {
  const extension = fileExtension(file)
  return file.type.startsWith("image/") || ALLOWED_EXTENSIONS.has(extension)
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read file"))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Unable to decode image"))
    image.src = src
  })
}

async function autoAdjustCatalogueImage(file: File): Promise<File> {
  const sourceUrl = await readAsDataUrl(file)
  const image = await loadImage(sourceUrl)
  const canvas = document.createElement("canvas")
  canvas.width = CATALOGUE_WIDTH
  canvas.height = CATALOGUE_HEIGHT

  const ctx = canvas.getContext("2d")
  if (!ctx) return file

  const targetRatio = CATALOGUE_WIDTH / CATALOGUE_HEIGHT
  const sourceRatio = image.width / image.height
  const cropWidth = sourceRatio > targetRatio ? image.height * targetRatio : image.width
  const cropHeight = sourceRatio > targetRatio ? image.height : image.width / targetRatio
  const cropX = (image.width - cropWidth) / 2
  const cropY = (image.height - cropHeight) / 2

  ctx.fillStyle = "#fdf6ee"
  ctx.fillRect(0, 0, CATALOGUE_WIDTH, CATALOGUE_HEIGHT)
  ctx.filter = "contrast(1.04) saturate(1.03) brightness(1.01)"
  ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, CATALOGUE_WIDTH, CATALOGUE_HEIGHT)
  ctx.filter = "none"

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.88)
  })

  if (!blob) return file
  const baseName = file.name.replace(/\.[^.]+$/, "") || "product-image"
  return new File([blob], `${baseName}-catalogue.jpg`, { type: "image/jpeg" })
}

async function uploadOrFallback(file: File) {
  try {
    const { supabase } = await import("@/lib/supabase/client")
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project")

    if (isPlaceholder) {
      throw new Error("Supabase storage is not configured")
    }

    const extension = fileExtension(file)
    const fileName = `${Math.random().toString(36).slice(2)}-${Date.now()}.${extension}`
    const filePath = `products/${fileName}`
    const { error } = await supabase.storage.from("product-images").upload(filePath, file)

    if (error) throw error

    const { data } = supabase.storage.from("product-images").getPublicUrl(filePath)
    return data.publicUrl
  } catch (error) {
    console.log("Product image upload fallback:", error)
    return readAsDataUrl(file)
  }
}

export function ProductImageUploader({
  value,
  onChange,
  title = "Product Images",
  fileInputId = "product-image-files",
  urlInputId = "product-image-url",
  maxImages = 10,
  recommendedImages = 5,
}: ProductImageUploaderProps) {
  const [uploadMode, setUploadMode] = useState<"upload" | "url">("upload")
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const [autoAdjust, setAutoAdjust] = useState(true)
  const [lastAdjustedCount, setLastAdjustedCount] = useState(0)

  async function processFiles(files: FileList | File[]) {
    const selectedFiles = Array.from(files)

    if (value.length + selectedFiles.length > maxImages) {
      toast.error(`You can upload a maximum of ${maxImages} images.`)
      return
    }

    setUploading(true)
    setLastAdjustedCount(0)

    const uploadedUrls: string[] = []
    let adjustedCount = 0

    for (const originalFile of selectedFiles) {
      if (!isSupportedImage(originalFile)) {
        toast.error(`File ${originalFile.name} is not a valid image format.`)
        continue
      }

      if (originalFile.size > MAX_FILE_SIZE) {
        toast.error(`File ${originalFile.name} exceeds 10MB limit.`)
        continue
      }

      let fileToUpload = originalFile

      if (autoAdjust && originalFile.type !== "image/svg+xml" && originalFile.type !== "image/gif") {
        try {
          fileToUpload = await autoAdjustCatalogueImage(originalFile)
          adjustedCount++
        } catch (error) {
          console.log("Catalogue auto-adjust failed, keeping original image:", error)
        }
      }

      uploadedUrls.push(await uploadOrFallback(fileToUpload))
    }

    if (uploadedUrls.length > 0) {
      onChange([...value, ...uploadedUrls])
      setLastAdjustedCount(adjustedCount)
      toast.success(`Loaded ${uploadedUrls.length} image${uploadedUrls.length === 1 ? "" : "s"}.`)
    }

    setUploading(false)
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      void processFiles(event.target.files)
      event.target.value = ""
    }
  }

  function handleDrag(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(event.type === "dragenter" || event.type === "dragover")
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)
    if (event.dataTransfer.files) void processFiles(event.dataTransfer.files)
  }

  function addUrlImage() {
    const trimmedUrl = urlInput.trim()
    if (!trimmedUrl) return

    if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
      toast.error("Please enter a valid HTTP/HTTPS image URL.")
      return
    }

    if (value.length >= maxImages) {
      toast.error(`You can upload a maximum of ${maxImages} images.`)
      return
    }

    onChange([...value, trimmedUrl])
    setUrlInput("")
    setLastAdjustedCount(0)
    toast.success("Image URL added.")
  }

  function removeImage(index: number) {
    onChange(value.filter((_, currentIndex) => currentIndex !== index))
  }

  const remainingRecommended = Math.max(0, recommendedImages - value.length)

  return (
    <section
      data-testid="product-image-uploader"
      style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "15px", fontWeight: "600", fontFamily: "var(--font-serif)", color: "var(--charcoal)", marginBottom: "10px" }}>
            {title}
          </h2>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "var(--charcoal)" }}>
            <input
              id="image-auto-adjust"
              type="checkbox"
              checked={autoAdjust}
              onChange={(event) => setAutoAdjust(event.target.checked)}
              style={{ accentColor: "var(--rose)", width: "15px", height: "15px", cursor: "pointer" }}
            />
            Auto-adjust catalogue images
          </label>
          <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "6px", lineHeight: 1.6 }}>
            Crops to a 3:4 catalogue ratio, resizes to 900 x 1200, and exports uploaded files as optimized JPEG previews.
          </p>
        </div>

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
          }}
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
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById(fileInputId)?.click()}
          className="quick-action-hover"
          style={{
            border: dragActive ? "2px dashed var(--rose)" : "2px dashed var(--border)",
            background: dragActive ? "rgba(201,149,108,0.04)" : "rgba(253,246,238,0.3)",
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
        >
          <input
            id={fileInputId}
            type="file"
            accept="image/*,.jpeg,.jpg,.png,.webp,.svg"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {uploading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <Loader2 size={32} className="animate-spin" style={{ color: "var(--rose)" }} />
              <p style={{ fontSize: "13px", color: "var(--muted)", fontWeight: "500" }}>Preparing catalogue images...</p>
            </div>
          ) : (
            <>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(201,149,108,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--rose)", marginBottom: "16px" }}>
                <Wand2 size={20} />
              </div>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--charcoal)", marginBottom: "4px" }}>
                Drag and drop catalogue images here, or <span style={{ color: "var(--rose)" }}>browse files</span>
              </p>
              <p style={{ fontSize: "11px", color: "var(--muted)" }}>
                Supports JPEG, JPG, PNG, WEBP, or SVG up to 10MB each.
              </p>
            </>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              id={urlInputId}
              value={urlInput}
              onChange={(event) => setUrlInput(event.target.value)}
              className="input"
              placeholder="https://images.unsplash.com/... (image URL)"
              style={{ paddingLeft: "40px" }}
            />
            <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", display: "flex", alignItems: "center" }}>
              <ImageIcon size={16} />
            </div>
          </div>
          <button type="button" onClick={addUrlImage} className="btn btn-primary" style={{ padding: "0 20px", borderRadius: "4px", fontSize: "12px", whiteSpace: "nowrap" }}>
            Add URL
          </button>
        </div>
      )}

      {lastAdjustedCount > 0 ? (
        <p role="status" style={{ fontSize: "12px", color: "#2E7D32", marginTop: "12px" }}>
          Auto-adjusted to catalogue format
        </p>
      ) : null}

      {value.length > 0 ? (
        <div style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", gap: "12px", flexWrap: "wrap" }}>
            <h3 style={{ fontSize: "12px", fontWeight: "700", color: "var(--charcoal)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Gallery Preview ({value.length} of {maxImages})
            </h3>
            <span style={{ fontSize: "11px", fontWeight: "600", padding: "4px 10px", borderRadius: "12px", background: remainingRecommended === 0 ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", color: remainingRecommended === 0 ? "#10B981" : "#F59E0B" }}>
              {remainingRecommended === 0 ? "Complete catalogue set" : `Add ${remainingRecommended} more for a fuller carousel`}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }} className="md:grid-cols-5">
            {value.map((url, index) => (
              <div key={`${url}-${index}`} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)", background: "var(--cream-dark)", aspectRatio: "3/4" }}>
                <img
                  data-testid="product-image-preview"
                  src={url}
                  alt={`Preview ${index + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", bottom: "6px", left: "6px", background: "rgba(15,23,42,0.75)", color: "white", fontSize: "9px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px" }}>
                  {index === 0 ? "Cover" : `#${index + 1}`}
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={{ position: "absolute", top: "6px", right: "6px", background: "rgba(255,255,255,0.9)", border: "none", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}
                  title="Remove image"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
