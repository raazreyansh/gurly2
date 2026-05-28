'use client'

import { useState } from 'react'
import { updateOrderStatus } from './actions'

export default function StatusSelect({ id, currentStatus }: { id: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [updating, setUpdating] = useState(false)

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value
    setUpdating(true)
    const result = await updateOrderStatus(id, nextStatus)
    if (result.success) {
      setStatus(nextStatus)
    } else {
      alert("Failed to update status: " + result.error)
    }
    setUpdating(false)
  }

  return (
    <select
      disabled={updating}
      value={status}
      onChange={handleStatusChange}
      className="border border-neutral-200 px-3 py-1.5 text-[9px] tracking-widest font-bold uppercase text-black bg-neutral-50 focus:outline-none focus:border-black cursor-pointer disabled:opacity-50"
    >
      <option value="PENDING">Pending</option>
      <option value="SHIPPED">Shipped</option>
      <option value="COMPLETED">Completed</option>
      <option value="CANCELLED">Cancelled</option>
    </select>
  )
}
