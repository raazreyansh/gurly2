'use client'

import { useCartStore } from '@/store/useCartStore'

export function OrderSummary() {
  const { items, getCartTotal } = useCartStore()
  const subtotal = getCartTotal()
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99
  const total = subtotal + shipping

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h4 className="text-sm font-semibold mb-4">Order Summary</h4>
      <div className="space-y-3 mb-4">
        {items.map(i => (
          <div key={i.product.id} className="flex items-center justify-between">
            <div className="text-sm">
              <div className="font-medium">{i.product.title}</div>
              <div className="text-xs text-neutral-500">Qty: {i.quantity}</div>
            </div>
            <div className="text-sm">₹ {(i.product.price * i.quantity).toLocaleString('en-IN')}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-sm text-neutral-600 mb-2">
        <span>Subtotal</span>
        <span>₹ {subtotal.toLocaleString('en-IN')}</span>
      </div>
      <div className="flex justify-between text-sm text-neutral-600 mb-4">
        <span>Shipping</span>
        <span>{shipping === 0 ? 'Free' : `₹ ${shipping}`}</span>
      </div>

      <div className="flex justify-between items-center font-medium text-brandBlack text-lg">
        <span>Total</span>
        <span>₹ {total.toLocaleString('en-IN')}</span>
      </div>
    </div>
  )
}

export default OrderSummary
