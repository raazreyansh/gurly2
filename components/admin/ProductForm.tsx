'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct, updateProduct } from '@/app/admin/products/actions'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { productSchema } from '@/lib/validations/product'
import { normalizeProductMedia } from '@/lib/product-media'

interface Category {
  id: string
  name: string
  slug: string | null
}

interface ExistingProduct {
  id: string
  title: string
  slug: string
  description: string
  price: number
  compareAtPrice: number | null
  stock: number
  featured: boolean
  categoryId: string
  media: any[]
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const FALLBACK_CATEGORIES = [
  { id: '1', name: 'Earrings', slug: 'earrings' },
  { id: '2', name: 'Necklaces', slug: 'necklaces' },
  { id: '3', name: 'Rings', slug: 'rings' },
  { id: '4', name: 'Bracelets', slug: 'bracelets' },
]

export default function ProductForm({ categories, existingProduct }: { categories: Category[]; existingProduct?: ExistingProduct }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isEditMode = !!existingProduct
  
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<Array<{ type: string; url: string; name: string }>>([])
  const [existingMedia, setExistingMedia] = useState<Array<{ type: string; url: string }>>(
    normalizeProductMedia(existingProduct?.media),
  )

  const [croppingIndex, setCroppingIndex] = useState<number | null>(null)
  const [zoom, setZoom] = useState<number>(1)
  const [offsetX, setOffsetX] = useState<number>(0)
  const [offsetY, setOffsetY] = useState<number>(0)
  
  const activeCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES

  const [formData, setFormData] = useState({
    title: existingProduct?.title || '',
    slug: existingProduct?.slug || '',
    description: existingProduct?.description || '',
    price: existingProduct?.price?.toString() || '',
    compareAtPrice: existingProduct?.compareAtPrice?.toString() || '',
    stock: existingProduct?.stock?.toString() || '10',
    featured: existingProduct?.featured ?? false,
    categoryId: existingProduct?.categoryId || activeCategories[0]?.id || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData({ ...formData, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    if (selectedFiles.length + files.length > 10) {
      toast.error('Maximum 10 files allowed')
      return
    }

    const updatedFiles = [...files, ...selectedFiles]
    setFiles(updatedFiles)

    const listPreviews = updatedFiles.map((file) => {
      let type = 'image'
      if (file.type.startsWith('video/')) {
        type = 'video'
      }
      return {
        type,
        url: URL.createObjectURL(file),
        name: file.name
      }
    })
    setPreviews(listPreviews)
  }

  const removeImage = (index: number) => {
    const updatedFiles = [...files]
    updatedFiles.splice(index, 1)
    setFiles(updatedFiles)

    const listPreviews = updatedFiles.map((file) => {
      let type = 'image'
      if (file.type.startsWith('video/')) {
        type = 'video'
      }
      return {
        type,
        url: URL.createObjectURL(file),
        name: file.name
      }
    })
    setPreviews(listPreviews)
  }

  const convertImageToWebP = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(file)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          const MAX_WIDTH = 1600
          const MAX_HEIGHT = 2000

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width)
            width = MAX_WIDTH
          }
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height)
            height = MAX_HEIGHT
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve(file)
            return
          }

          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file)
                return
              }
              const convertedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, "") + ".webp",
                { type: 'image/webp', lastModified: Date.now() }
              )
              resolve(convertedFile)
            },
            'image/webp',
            0.85
          )
        }
        img.onerror = () => resolve(file)
        img.src = e.target?.result as string
      }
      reader.onerror = () => resolve(file)
      reader.readAsDataURL(file)
    })
  }

  useEffect(() => {
    if (croppingIndex === null) return
    const file = files[croppingIndex]
    if (!file) return

    const canvas = document.getElementById('cropCanvas') as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.src = previews[croppingIndex]?.url || URL.createObjectURL(file)
    img.onload = () => {
      canvas.width = 600
      canvas.height = 800
      ctx.fillStyle = '#111111'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const scale = zoom
      const w = canvas.width * scale
      const h = (canvas.width * (img.height / img.width)) * scale
      
      const x = (canvas.width - w) / 2 + (offsetX * 3 * scale)
      const y = (canvas.height - h) / 2 + (offsetY * 3 * scale)

      ctx.drawImage(img, x, y, w, h)
    }
  }, [croppingIndex, zoom, offsetX, offsetY])

  const handleApplyCrop = () => {
    if (croppingIndex === null) return
    const canvas = document.getElementById('cropCanvas') as HTMLCanvasElement
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (!blob) return

      const file = files[croppingIndex]
      const croppedFile = new File(
        [blob],
        file.name.replace(/\.[^/.]+$/, "") + "-cropped.webp",
        { type: 'image/webp', lastModified: Date.now() }
      )

      const updatedFiles = [...files]
      updatedFiles[croppingIndex] = croppedFile

      const updatedPreviews = [...previews]
      updatedPreviews[croppingIndex] = {
        type: 'image',
        url: URL.createObjectURL(croppedFile),
        name: croppedFile.name
      }

      setFiles(updatedFiles)
      setPreviews(updatedPreviews)
      setCroppingIndex(null)
      
      setZoom(1)
      setOffsetX(0)
      setOffsetY(0)
    }, 'image/webp', 0.95)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.categoryId) {
      toast.error("Please select at least one category.")
      return
    }

    setLoading(true)
    const toastId = toast.loading(isEditMode ? "Saving changes..." : "Creating product...")

    try {
      const uploadedMedia: Array<{ type: string; url: string }> = []

      if (files.length > 0) {
        for (let file of files) {
          if (file.type.startsWith('image/')) {
            try {
              file = await convertImageToWebP(file)
            } catch (err) {
              console.error("WebP conversion failed:", err)
            }
          }

          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          
          let fileType = 'image'
          if (file.type.startsWith('video/')) {
            fileType = 'video'
          }

          const { error } = await supabase.storage
            .from('products')
            .upload(fileName, file, {
              contentType: file.type,
              upsert: true
            })

          if (error) {
            throw new Error(`Supabase upload failed: ${error.message}`)
          }

          const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(fileName)

          uploadedMedia.push({
            type: fileType,
            url: publicUrl
          })
        }
      }

      const finalMedia = normalizeProductMedia([...existingMedia, ...uploadedMedia])

      const payload = {
        title: formData.title.trim(),
        slug: slugify(formData.slug || formData.title),
        description: formData.description,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
        stock: Number(formData.stock),
        featured: formData.featured,
        categoryId: formData.categoryId,
        media: finalMedia,
      }

      // Pre-validation using client Zod check
      const validationResult = productSchema.safeParse(payload)
      if (!validationResult.success) {
        const errorMsg = validationResult.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')
        throw new Error(`Validation Error: ${errorMsg}`)
      }

      const result = isEditMode
        ? await updateProduct(existingProduct!.id, payload)
        : await createProduct(payload)

      if (result.success) {
        toast.success(isEditMode ? "Product updated successfully!" : "Product created successfully!", { id: toastId })
        router.push('/admin/products')
        router.refresh()
      } else {
        throw new Error(result.error || "Execution failed")
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred", { id: toastId })
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-3xl border border-neutral-200 p-8 lg:p-12 space-y-8 bg-white text-black select-none">
        <h2 className="text-[10px] tracking-[0.25em] font-bold text-neutral-400 uppercase border-b border-neutral-100 pb-3">
          Listing Particulars
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400 font-mono">Jewel Title *</label>
            <input
              required
              type="text"
              name="title"
              placeholder="e.g. Royal Gold Choker"
              value={formData.title}
              onChange={handleChange}
              className="border border-neutral-200 p-3.5 text-xs font-semibold text-black uppercase tracking-wider focus:border-black focus:outline-none bg-neutral-50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400 font-mono">Slug (auto if blank)</label>
            <input
              type="text"
              name="slug"
              placeholder="e.g. royal-gold-choker"
              value={formData.slug}
              onChange={handleChange}
              className="border border-neutral-200 p-3.5 text-xs font-semibold text-black focus:border-black focus:outline-none bg-neutral-50 font-mono"
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400 font-mono">Assigned Category Capsule *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="border border-neutral-200 p-3.5 text-xs font-semibold text-black uppercase tracking-wider focus:border-black focus:outline-none bg-neutral-50"
            >
              {activeCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} Collection
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400 font-mono">Editorial Description Copy *</label>
            <textarea
              required
              name="description"
              rows={4}
              placeholder="Detailed narrative explaining historical background, craftsmanship accents..."
              value={formData.description}
              onChange={handleChange}
              className="border border-neutral-200 p-3.5 text-xs font-semibold text-black focus:border-black focus:outline-none bg-neutral-50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400 font-mono">Retail Price (₹) *</label>
            <input
              required
              type="number"
              name="price"
              placeholder="2999"
              value={formData.price}
              onChange={handleChange}
              className="border border-neutral-200 p-3.5 text-xs font-semibold font-mono text-black focus:border-black focus:outline-none bg-neutral-50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400 font-mono">Compare Price (₹)</label>
            <input
              type="number"
              name="compareAtPrice"
              placeholder="3999"
              value={formData.compareAtPrice}
              onChange={handleChange}
              className="border border-neutral-200 p-3.5 text-xs font-semibold font-mono text-black focus:border-black focus:outline-none bg-neutral-50"
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400 font-mono">Stock Units *</label>
            <input
              required
              type="number"
              name="stock"
              placeholder="12"
              value={formData.stock}
              onChange={handleChange}
              className="border border-neutral-200 p-3.5 text-xs font-semibold font-mono text-black focus:border-black focus:outline-none bg-neutral-50"
            />
          </div>
        </div>

        <div className="space-y-6 pt-4 border-t border-neutral-100">
          <div>
            <label className="mb-3 block text-[9px] tracking-[0.25em] font-bold text-neutral-400 uppercase font-mono">
              PRODUCT MEDIA PORTFOLIO
            </label>

            <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center border border-dashed border-neutral-300 bg-[#FBFBF9] transition hover:border-black p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-black">
                Click to Upload Campaign Media
              </p>
              <p className="mt-1 text-[10px] text-neutral-400 font-medium font-mono uppercase text-center">
                Auto-adjusts images to WebP, max 1600x2000, before publish
              </p>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFiles}
                className="hidden"
              />
            </label>
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 bg-neutral-100 p-3 border border-neutral-200">
              {previews.map((preview, index) => (
                <div key={index} className="group relative bg-white border border-neutral-200 overflow-hidden flex items-center justify-center">
                  {preview.type === 'image' && (
                    <img
                      src={preview.url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="aspect-square w-full object-cover pointer-events-none select-none"
                    />
                  )}

                  {preview.type === 'video' && (
                    <video
                      src={preview.url}
                      autoPlay
                      muted
                      loop
                      className="aspect-square w-full object-cover pointer-events-none select-none"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition flex flex-col justify-stretch select-none">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="flex-1 border-b border-white/10 text-[8px] font-mono font-bold tracking-[0.2em] text-red-400 hover:bg-red-950/20 uppercase cursor-pointer"
                    >
                      Remove
                    </button>
                    {preview.type === 'image' && (
                      <button
                        type="button"
                        onClick={() => {
                          setCroppingIndex(index)
                          setZoom(1)
                          setOffsetX(0)
                          setOffsetY(0)
                        }}
                        className="flex-1 text-[8px] font-mono font-bold tracking-[0.2em] text-white hover:bg-white/10 uppercase cursor-pointer"
                      >
                        Crop
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-neutral-100">
          <label className="flex items-center gap-3 border border-neutral-200 p-3.5 bg-neutral-50 cursor-pointer select-none">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4.5 w-4.5 accent-black cursor-pointer"
            />
            <span className="text-[10px] tracking-wider font-bold uppercase font-mono">Featured Spotlight</span>
          </label>
        </div>

        {isEditMode && existingMedia.length > 0 && (
          <div className="pt-4 border-t border-neutral-100 space-y-3">
            <label className="block text-[9px] tracking-[0.25em] font-bold text-neutral-400 uppercase font-mono">
              Current Media ({existingMedia.length})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-neutral-100 p-3 border border-neutral-200">
              {existingMedia.map((m, i) => (
                <div key={i} className="group relative bg-white border border-neutral-200 overflow-hidden">
                  {m.type === 'video' ? (
                    <video src={m.url} muted className="aspect-square w-full object-cover" />
                  ) : (
                    <img src={m.url} alt="" loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => setExistingMedia(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[8px] font-mono font-bold tracking-[0.2em] text-red-400 uppercase cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-black py-4.5 text-xs font-semibold tracking-[0.3em] uppercase text-white hover:opacity-85 transition disabled:opacity-50 mt-6 cursor-pointer"
        >
          {loading
            ? (isEditMode ? 'SAVING CHANGES...' : 'CREATING CATALOG ENTRY...')
            : (isEditMode ? 'SAVE CHANGES' : 'CREATE PRODUCT')}
        </button>
      </form>

      {croppingIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-white max-w-md w-full p-6 border border-neutral-200 flex flex-col gap-5 shadow-2xl">
            <div className="border-b border-neutral-100 pb-3.5 flex justify-between items-center">
              <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-black font-mono">
                Image Composition Studio
              </h3>
              <button 
                type="button" 
                onClick={() => setCroppingIndex(null)}
                className="text-neutral-400 hover:text-black uppercase tracking-widest text-[9px] font-mono font-bold cursor-pointer"
              >
                ✕ Cancel
              </button>
            </div>

            <div className="relative aspect-[3/4] max-h-[360px] w-full bg-neutral-950 overflow-hidden flex items-center justify-center border border-neutral-200">
              <canvas id="cropCanvas" className="max-w-full max-h-full object-contain" />
              <div className="absolute inset-4 border border-dashed border-white/40 pointer-events-none flex items-center justify-center">
                <span className="text-[7px] font-mono tracking-[0.3em] text-white bg-black/70 px-2 py-1 select-none">
                  3:4 LUXURY CROP BOUNDS
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-neutral-100">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[8px] tracking-widest font-mono uppercase text-neutral-400 font-bold">
                  <span>Composition Zoom</span>
                  <span className="text-black">{Math.round(zoom * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  step="0.05"
                  value={zoom} 
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1 bg-neutral-100 accent-black appearance-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[8px] tracking-widest font-mono uppercase text-neutral-400 font-bold">Align Horiz</span>
                  <input 
                    type="range" 
                    min="-80" 
                    max="80" 
                    value={offsetX} 
                    onChange={(e) => setOffsetX(parseInt(e.target.value))}
                    className="w-full h-1 bg-neutral-100 accent-black appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[8px] tracking-widest font-mono uppercase text-neutral-400 font-bold">Align Vert</span>
                  <input 
                    type="range" 
                    min="-80" 
                    max="80" 
                    value={offsetY} 
                    onChange={(e) => setOffsetY(parseInt(e.target.value))}
                    className="w-full h-1 bg-neutral-100 accent-black appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyCrop}
              className="w-full bg-black text-white py-3.5 text-xs font-semibold tracking-[0.25em] uppercase hover:opacity-85 transition cursor-pointer"
            >
              Apply Composition & Crop
            </button>
          </div>
        </div>
      )}
    </>
  )
}
