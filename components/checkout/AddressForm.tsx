'use client'

import { useState } from 'react'

export function AddressForm({ onChange }: { onChange?: (data: any) => void }) {
  const [form, setForm] = useState({ name: '', line1: '', line2: '', city: '', state: '', postal: '', country: 'India', phone: '' })

  function update(key: string, value: string) {
    const next = { ...form, [key]: value }
    setForm(next)
    onChange?.(next)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Full name" className="w-full border border-neutral-200 rounded-md px-3 py-3" />
        <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Phone" className="w-full border border-neutral-200 rounded-md px-3 py-3" />
      </div>

      <input value={form.line1} onChange={(e) => update('line1', e.target.value)} placeholder="Address line 1" className="w-full border border-neutral-200 rounded-md px-3 py-3" />
      <input value={form.line2} onChange={(e) => update('line2', e.target.value)} placeholder="Address line 2 (optional)" className="w-full border border-neutral-200 rounded-md px-3 py-3" />

      <div className="grid grid-cols-2 gap-4">
        <input value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="City" className="w-full border border-neutral-200 rounded-md px-3 py-3" />
        <input value={form.state} onChange={(e) => update('state', e.target.value)} placeholder="State" className="w-full border border-neutral-200 rounded-md px-3 py-3" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input value={form.postal} onChange={(e) => update('postal', e.target.value)} placeholder="Postal code" className="w-full border border-neutral-200 rounded-md px-3 py-3" />
        <input value={form.country} onChange={(e) => update('country', e.target.value)} placeholder="Country" className="w-full border border-neutral-200 rounded-md px-3 py-3" />
      </div>
    </div>
  )
}

export default AddressForm
