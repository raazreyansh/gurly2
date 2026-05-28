'use client'

import { useState, useTransition } from 'react'
import { deleteCategory, updateCategory } from '@/app/admin/categories/actions'
import { Pencil, Save, Trash2, X } from 'lucide-react'

interface CategoryRow {
  id: string
  name: string
  slug: string | null
  products?: Array<{ id: string }>
}

export default function CategoryTableClient({ categories }: { categories: CategoryRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const [draftSlug, setDraftSlug] = useState('')
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  const beginEdit = (category: CategoryRow) => {
    setMessage('')
    setEditingId(category.id)
    setDraftName(category.name)
    setDraftSlug(category.slug || '')
  }

  const saveEdit = (categoryId: string) => {
    startTransition(async () => {
      const result = await updateCategory(categoryId, draftName, draftSlug)
      if (result.success) {
        setEditingId(null)
      } else {
        setMessage(result.error || 'Could not update category.')
      }
    })
  }

  const removeCategory = (category: CategoryRow) => {
    if (!confirm(`Delete category "${category.name}"? This only works when no products are assigned.`)) return

    startTransition(async () => {
      const result = await deleteCategory(category.id)
      if (!result.success) {
        setMessage(result.error || 'Could not delete category.')
      }
    })
  }

  if (categories.length === 0) {
    return (
      <div className="p-16 text-center text-xs text-neutral-400 font-semibold tracking-wider bg-white">
        NO CATEGORIES FOUND IN DATABASE
      </div>
    )
  }

  return (
    <div>
      {message && (
        <div className="border-b border-red-100 bg-red-50 px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-red-600">
          {message}
        </div>
      )}
      <table className="w-full text-left border-collapse bg-white">
        <thead>
          <tr className="border-b border-neutral-200 text-[9px] tracking-[0.25em] font-bold text-neutral-400 uppercase bg-neutral-50/50">
            <th className="px-6 py-4">Capsule Class</th>
            <th className="px-6 py-4">URL Slug</th>
            <th className="px-6 py-4 text-right">Items Count</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 text-xs text-black">
          {categories.map((category) => {
            const isEditing = editingId === category.id
            const productCount = category.products?.length || 0

            return (
              <tr key={category.id} className="hover:bg-neutral-50/30 transition">
                <td className="px-6 py-4 font-semibold uppercase tracking-wider text-black">
                  {isEditing ? (
                    <input
                      value={draftName}
                      onChange={(event) => setDraftName(event.target.value)}
                      className="w-full border border-neutral-200 bg-neutral-50 p-2 text-xs font-semibold uppercase tracking-wider outline-none focus:border-black"
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td className="px-6 py-4 text-neutral-400 font-mono text-[10px]">
                  {isEditing ? (
                    <input
                      value={draftSlug}
                      onChange={(event) => setDraftSlug(event.target.value)}
                      className="w-full border border-neutral-200 bg-neutral-50 p-2 font-mono text-[10px] outline-none focus:border-black"
                    />
                  ) : (
                    `/${category.slug || category.name.toLowerCase()}`
                  )}
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold text-black">
                  {productCount} items
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => saveEdit(category.id)}
                          className="inline-flex items-center gap-1 border border-black bg-black px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-white disabled:opacity-50"
                        >
                          <Save className="h-3.5 w-3.5" /> Save
                        </button>
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1 border border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-neutral-500 disabled:opacity-50"
                        >
                          <X className="h-3.5 w-3.5" /> Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => beginEdit(category)}
                          className="inline-flex items-center gap-1 border border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-neutral-500 hover:border-black hover:text-black"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          disabled={isPending || productCount > 0}
                          onClick={() => removeCategory(category)}
                          title={productCount > 0 ? 'Move products before deleting this category' : 'Delete category'}
                          className="inline-flex items-center gap-1 border border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-neutral-500 hover:border-red-200 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
