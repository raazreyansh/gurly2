'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct } from '@/app/admin/products/actions'
import { supabase } from '@/lib/supabase'

interface Category {
  id: string
  name: string
  slug: string | null
}

const FALLBACK_CATEGORIES = [
  { id: '1', name: 'Earrings', slug: 'earrings' },
  { id: '2', name: 'Necklaces', slug: 'necklaces' },
  { id: '3', name: 'Rings', slug: 'rings' },
  { id: '4', name: 'Bracelets', slug: 'bracelets' },
]

export default function ProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Multi-format media state
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<Array<{ type: string; url: string; name: string }>>([])
  
  const activeCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    compareAtPrice: '',
    stock: '10',
    featured: false,
    categoryId: activeCategories[0]?.id || '',
    // Luxury properties
    material: '18k Solid Gold',
    plating: '24k Gold Plated',
    gemstone: 'None',
    antiTarnish: true,
    waterproof: true,
    hypoallergenic: true,
    handcrafted: true,
    shippingDays: '3',
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

  // Handle files upload preview across multiple media types
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    if (selectedFiles.length + files.length > 10) {
      alert('Maximum 10 files allowed')
      return
    }

    const updatedFiles = [...files, ...selectedFiles]
    setFiles(updatedFiles)

    const listPreviews = updatedFiles.map((file) => {
      let type = 'image'
      if (file.type.startsWith('video/')) {
        type = 'video'
      } else if (file.type === 'application/pdf') {
        type = 'pdf'
      } else if (file.type.includes('zip') || file.name.endsWith('.zip')) {
        type = 'zip'
      }
      return {
        type,
        url: URL.createObjectURL(file),
        name: file.name
      }
    })
    setPreviews(listPreviews)
  }

  // Remove preview asset
  const removeImage = (index: number) => {
    const updatedFiles = [...files]
    updatedFiles.splice(index, 1)
    setFiles(updatedFiles)

    const listPreviews = updatedFiles.map((file) => {
      let type = 'image'
      if (file.type.startsWith('video/')) {
        type = 'video'
      } else if (file.type === 'application/pdf') {
        type = 'pdf'
      } else if (file.type.includes('zip') || file.name.endsWith('.zip')) {
        type = 'zip'
      }
      return {
        type,
        url: URL.createObjectURL(file),
        name: file.name
      }
    })
    setPreviews(listPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.categoryId) {
      alert("Please select or create at least one category.")
      return
    }

    setLoading(true)

    try {
      const uploadedMedia: Array<{ type: string; url: string }> = []

      // Upload file arrays directly to Supabase storage 'products' bucket
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          
          let fileType = 'image'
          if (file.type.startsWith('video/')) {
            fileType = 'video'
          } else if (file.type === 'application/pdf') {
            fileType = 'pdf'
          } else if (file.type.includes('zip') || file.name.endsWith('.zip')) {
            fileType = 'zip'
          }

          // Upload with precise content-type headers so Supabase serves files correctly
          const { error } = await supabase.storage
            .from('products')
            .upload(fileName, file, {
              contentType: file.type,
              upsert: true
            })

          if (error) {
            console.error("Supabase Storage Upload Error:", error)
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

      const result = await createProduct({
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
        stock: Number(formData.stock),
        featured: formData.featured,
        categoryId: formData.categoryId,
        media: uploadedMedia, // dynamic structured media catalog objects!
        material: formData.material,
        plating: formData.plating,
        gemstone: formData.gemstone,
        antiTarnish: formData.antiTarnish,
        waterproof: formData.waterproof,
        hypoallergenic: formData.hypoallergenic,
        handcrafted: formData.handcrafted,
        shippingDays: Number(formData.shippingDays),
      })

      if (result.success) {
        router.push('/admin/products')
      } else {
        alert("Error: " + result.error)
        setLoading(false)
      }
    } catch (err: any) {
      alert("Unexpected error: " + err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl border border-neutral-200 p-8 lg:p-12 space-y-8 bg-white text-black select-none">
      {/* Title Header */}
      <h2 className="text-[10px] tracking-[0.25em] font-bold text-neutral-400 uppercase border-b border-neutral-100 pb-3">
        Listing Particulars
      </h2>

      {/* Main product specs grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Jewel Title *</label>
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

        {/* Slug */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Slug (URL Parameter)</label>
          <input
            type="text"
            name="slug"
            placeholder="e.g. royal-gold-choker"
            value={formData.slug}
            onChange={handleChange}
            className="border border-neutral-200 p-3.5 text-xs font-semibold text-black focus:border-black focus:outline-none bg-neutral-50"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Assigned Category Capsule *</label>
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

        {/* Description */}
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Editorial Description Copy</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Detailed narrative explaining historical background, craftsmanship accents..."
            value={formData.description}
            onChange={handleChange}
            className="border border-neutral-200 p-3.5 text-xs font-semibold text-black focus:border-black focus:outline-none bg-neutral-50"
          />
        </div>

        {/* Price info */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Retail Price (₹) *</label>
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
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Compare Price (₹)</label>
          <input
            type="number"
            name="compareAtPrice"
            placeholder="3999"
            value={formData.compareAtPrice}
            onChange={handleChange}
            className="border border-neutral-200 p-3.5 text-xs font-semibold font-mono text-black focus:border-black focus:outline-none bg-neutral-50"
          />
        </div>

        {/* Stock */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Stock Units *</label>
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

        {/* Shipping Days */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Fulfillment Ships Days *</label>
          <input
            required
            type="number"
            name="shippingDays"
            placeholder="3"
            value={formData.shippingDays}
            onChange={handleChange}
            className="border border-neutral-200 p-3.5 text-xs font-semibold font-mono text-black focus:border-black focus:outline-none bg-neutral-50"
          />
        </div>

        {/* Materials details */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Luxury Base Material *</label>
          <input
            required
            type="text"
            name="material"
            placeholder="e.g. 18k Solid Gold"
            value={formData.material}
            onChange={handleChange}
            className="border border-neutral-200 p-3.5 text-xs font-semibold text-black uppercase tracking-wider focus:border-black focus:outline-none bg-neutral-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Plating Overlay</label>
          <input
            type="text"
            name="plating"
            placeholder="e.g. 24k Gold Plated"
            value={formData.plating}
            onChange={handleChange}
            className="border border-neutral-200 p-3.5 text-xs font-semibold text-black uppercase tracking-wider focus:border-black focus:outline-none bg-neutral-50"
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Gemstone Settings</label>
          <input
            type="text"
            name="gemstone"
            placeholder="e.g. Solitaire Cubic Zirconia / None"
            value={formData.gemstone}
            onChange={handleChange}
            className="border border-neutral-200 p-3.5 text-xs font-semibold text-black uppercase tracking-wider focus:border-black focus:outline-none bg-neutral-50"
          />
        </div>
      </div>

      {/* Multiple Media Uploader Section */}
      <div className="space-y-6 pt-4 border-t border-neutral-100">
        <div>
          <label className="mb-3 block text-[9px] tracking-[0.25em] font-bold text-neutral-400 uppercase">
            PRODUCT MEDIA PORTFOLIO
          </label>

          <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center border border-dashed border-neutral-300 bg-[#FBFBF9] transition hover:border-black p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-black">
              Click to Upload Campaign Media
            </p>
            <p className="mt-1 text-[10px] text-neutral-400 font-medium font-mono uppercase text-center max-w-md">
              Supports: Images, Videos, PDFs, ZIP campaigns (MAX 10)
            </p>
            <input
              type="file"
              multiple
              accept="image/*,video/*,application/pdf,application/zip,application/x-zip-compressed"
              onChange={handleFiles}
              className="hidden"
            />
          </label>
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 bg-neutral-100 p-3 border border-neutral-200">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="group relative bg-white border border-neutral-200 overflow-hidden flex items-center justify-center"
              >
                {preview.type === 'image' && (
                  <img
                    src={preview.url}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />
                )}

                {preview.type === 'video' && (
                  <video
                    src={preview.url}
                    autoPlay
                    muted
                    loop
                    className="aspect-square w-full object-cover"
                  />
                )}

                {preview.type === 'pdf' && (
                  <div className="aspect-square w-full flex flex-col items-center justify-center bg-neutral-50 p-2 text-center select-none">
                    <span className="text-xs font-black tracking-widest text-red-600 bg-red-50 border border-red-200 px-2 py-1">PDF</span>
                    <span className="text-[8px] text-neutral-400 font-bold uppercase truncate max-w-full mt-2.5 px-1">{preview.name}</span>
                  </div>
                )}

                {preview.type === 'zip' && (
                  <div className="aspect-square w-full flex flex-col items-center justify-center bg-neutral-50 p-2 text-center select-none">
                    <span className="text-xs font-black tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1">ZIP</span>
                    <span className="text-[8px] text-neutral-400 font-bold uppercase truncate max-w-full mt-2.5 px-1">{preview.name}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[9px] font-bold tracking-[0.2em] text-white uppercase cursor-pointer"
                >
                  Remove Asset
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trust guarantees checkboxes */}
      <div className="pt-4 border-t border-neutral-100 space-y-4">
        <label className="mb-2 block text-[9px] tracking-[0.25em] font-bold text-neutral-400 uppercase">
          Guarantees & Badges
        </label>
        
        <div className="grid grid-cols-2 gap-3 text-black">
          <label className="flex items-center gap-3 border border-neutral-200 p-3.5 bg-neutral-50 cursor-pointer select-none">
            <input
              type="checkbox"
              name="antiTarnish"
              checked={formData.antiTarnish}
              onChange={handleChange}
              className="h-4.5 w-4.5 accent-black cursor-pointer"
            />
            <span className="text-[10px] tracking-wider font-bold uppercase">Anti-Tarnish</span>
          </label>

          <label className="flex items-center gap-3 border border-neutral-200 p-3.5 bg-[#FAF9F5] border-neutral-300/60 cursor-pointer select-none">
            <input
              type="checkbox"
              name="waterproof"
              checked={formData.waterproof}
              onChange={handleChange}
              className="h-4.5 w-4.5 accent-black cursor-pointer"
            />
            <span className="text-[10px] tracking-wider font-bold uppercase">Waterproof</span>
          </label>

          <label className="flex items-center gap-3 border border-neutral-200 p-3.5 bg-[#FAF9F5] border-neutral-300/60 cursor-pointer select-none">
            <input
              type="checkbox"
              name="hypoallergenic"
              checked={formData.hypoallergenic}
              onChange={handleChange}
              className="h-4.5 w-4.5 accent-black cursor-pointer"
            />
            <span className="text-[10px] tracking-wider font-bold uppercase">Hypoallergenic</span>
          </label>

          <label className="flex items-center gap-3 border border-neutral-200 p-3.5 bg-neutral-50 cursor-pointer select-none">
            <input
              type="checkbox"
              name="handcrafted"
              checked={formData.handcrafted}
              onChange={handleChange}
              className="h-4.5 w-4.5 accent-black cursor-pointer"
            />
            <span className="text-[10px] tracking-wider font-bold uppercase">Handcrafted</span>
          </label>
        </div>

        <label className="flex sm:col-span-2 items-center gap-3 border border-neutral-200 p-3.5 bg-neutral-50 cursor-pointer select-none">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4.5 w-4.5 accent-black cursor-pointer"
          />
          <span className="text-[10px] tracking-wider font-bold uppercase">Featured Listing Spotlight</span>
        </label>
      </div>

      {/* Submit Trigger */}
      <button
        disabled={loading}
        type="submit"
        className="w-full bg-black py-4.5 text-xs font-semibold tracking-[0.3em] uppercase text-white hover:opacity-85 transition disabled:opacity-50 mt-6 cursor-pointer"
      >
        {loading ? 'CREATING CATALOG ENTRY...' : 'CREATE PRODUCT'}
      </button>
    </form>
  )
}
