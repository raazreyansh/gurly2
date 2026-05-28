'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct } from '@/app/admin/products/actions'

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
    imageUrl: '/images/models/community_2.png',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.categoryId) {
      alert("Please ensure at least one category exists or is selected before creating a product.")
      return
    }

    setLoading(true)

    const result = await createProduct({
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
      stock: Number(formData.stock),
      featured: formData.featured,
      categoryId: formData.categoryId,
      imageUrl: formData.imageUrl,
    })

    if (result.success) {
      router.push('/admin/products')
    } else {
      alert("Error: " + result.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl border border-neutral-200 p-8 lg:p-12 space-y-6 bg-white text-black">
      <h2 className="text-[10px] tracking-[0.25em] font-semibold text-neutral-400 uppercase border-b border-neutral-100 pb-3">
        Listing Particulars
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Jewel Title *</label>
          <input
            required
            type="text"
            name="title"
            placeholder="e.g. Vintage Gold Hoop"
            value={formData.title}
            onChange={handleChange}
            className="border border-neutral-200 p-3.5 text-xs font-semibold text-black uppercase tracking-wider focus:border-black focus:outline-none bg-neutral-50"
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Slug (URL parameter)</label>
          <input
            type="text"
            name="slug"
            placeholder="e.g. vintage-gold-hoop"
            value={formData.slug}
            onChange={handleChange}
            className="border border-neutral-200 p-3.5 text-xs font-semibold text-black focus:border-black focus:outline-none bg-neutral-50"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Assigned Category *</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="border border-neutral-200 p-3.5 text-xs font-semibold text-black uppercase tracking-wider focus:border-black focus:outline-none bg-neutral-50"
          >
            {activeCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Item Description</label>
          <textarea
            name="description"
            rows={4}
            placeholder="Detailed editorial copy explaining materials, sizing, and fine details..."
            value={formData.description}
            onChange={handleChange}
            className="border border-neutral-200 p-3.5 text-xs font-semibold text-black focus:border-black focus:outline-none bg-neutral-50"
          />
        </div>

        {/* Price */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Retail Price (₹) *</label>
          <input
            required
            type="number"
            name="price"
            placeholder="e.g. 2999"
            value={formData.price}
            onChange={handleChange}
            className="border border-neutral-200 p-3.5 text-xs font-semibold font-mono text-black focus:border-black focus:outline-none bg-neutral-50"
          />
        </div>

        {/* Compare price */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Strikeout Price (₹)</label>
          <input
            type="number"
            name="compareAtPrice"
            placeholder="e.g. 3999"
            value={formData.compareAtPrice}
            onChange={handleChange}
            className="border border-neutral-200 p-3.5 text-xs font-semibold font-mono text-black focus:border-black focus:outline-none bg-neutral-50"
          />
        </div>

        {/* Stock */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Initial Stock Units *</label>
          <input
            required
            type="number"
            name="stock"
            placeholder="10"
            value={formData.stock}
            onChange={handleChange}
            className="border border-neutral-200 p-3.5 text-xs font-semibold font-mono text-black focus:border-black focus:outline-none bg-neutral-50"
          />
        </div>

        {/* Image Mock */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Mock Visual Asset *</label>
          <select
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="border border-neutral-200 p-3.5 text-xs font-semibold text-black uppercase tracking-wider focus:border-black focus:outline-none bg-neutral-50"
          >
            <option value="/images/models/community_1.png">Earring model visual</option>
            <option value="/images/models/community_2.png">Pendant model visual</option>
            <option value="/images/models/community_3.png">Solitaire ring visual</option>
            <option value="/images/models/community_4.png">Cuff bracelet visual</option>
          </select>
        </div>

        {/* Featured checkbox */}
        <div className="sm:col-span-2 flex items-center gap-3 border border-neutral-100 p-4 bg-neutral-50">
          <input
            type="checkbox"
            name="featured"
            id="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4.5 w-4.5 accent-black cursor-pointer"
          />
          <label htmlFor="featured" className="text-[10px] tracking-widest font-bold uppercase text-black cursor-pointer select-none">
            Highlight as Featured Pick on Storefront
          </label>
        </div>
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full bg-black py-4.5 text-xs font-semibold tracking-[0.3em] uppercase text-white hover:opacity-85 transition disabled:opacity-50 mt-6"
      >
        {loading ? 'CREATING CATALOG ENTRY...' : 'CREATE PRODUCT'}
      </button>
    </form>
  )
}
