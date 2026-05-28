'use client'

import { useState } from 'react'
import { createCategory } from '@/app/admin/categories/actions'

export default function CategoryForm() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    const result = await createCategory(name)
    if (result.success) {
      setName('')
    } else {
      alert("Error: " + result.error)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="border border-neutral-200 p-8 bg-white max-w-md space-y-4 flex flex-col justify-between h-56">
      <div>
        <h2 className="text-[10px] tracking-[0.25em] font-semibold text-neutral-400 uppercase border-b border-neutral-100 pb-3">
          Create New Category
        </h2>
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-[8px] tracking-widest font-bold uppercase text-neutral-400">Category Name *</label>
          <input
            required
            type="text"
            placeholder="e.g. Brooches"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-neutral-200 p-3.5 text-xs font-semibold text-black uppercase tracking-wider focus:border-black focus:outline-none bg-neutral-50"
          />
        </div>
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full bg-black py-4 text-xs font-semibold tracking-widest uppercase text-white hover:opacity-85 transition disabled:opacity-50"
      >
        {loading ? 'CREATING...' : 'ADD CATEGORY'}
      </button>
    </form>
  )
}
