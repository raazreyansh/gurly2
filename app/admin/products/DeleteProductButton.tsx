'use client'

import { useState } from 'react'
import { deleteProduct } from './actions'
import { Trash2 } from 'lucide-react'

export default function DeleteProductButton({ id }: { id: string }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product from the live catalog?")) {
      return
    }

    setDeleting(true)
    const result = await deleteProduct(id)
    if (!result.success) {
      alert("Failed to delete the product. Please try again.")
      setDeleting(false)
    }
  }

  return (
    <button
      disabled={deleting}
      onClick={handleDelete}
      className="p-2 text-neutral-400 hover:text-red-500 disabled:opacity-50 transition inline-flex items-center"
      title="Delete Product"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
