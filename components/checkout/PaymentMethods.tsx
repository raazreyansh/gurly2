'use client'

import { useState } from 'react'

export function PaymentMethods({ onSelect }: { onSelect?: (method: string) => void }) {
  const [method, setMethod] = useState('card')

  function select(m: string) {
    setMethod(m)
    onSelect?.(m)
  }

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-md border ${method === 'card' ? 'border-black' : 'border-neutral-200'}`}>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="radio" name="payment" checked={method === 'card'} onChange={() => select('card')} />
          <div>
            <div className="font-medium">Card</div>
            <div className="text-sm text-neutral-500">Visa, MasterCard, Amex</div>
          </div>
        </label>
      </div>

      <div className={`p-4 rounded-md border ${method === 'upi' ? 'border-black' : 'border-neutral-200'}`}>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="radio" name="payment" checked={method === 'upi'} onChange={() => select('upi')} />
          <div>
            <div className="font-medium">UPI</div>
            <div className="text-sm text-neutral-500">Google Pay, PhonePe, Paytm</div>
          </div>
        </label>
      </div>

      <div className={`p-4 rounded-md border ${method === 'cod' ? 'border-black' : 'border-neutral-200'}`}>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="radio" name="payment" checked={method === 'cod'} onChange={() => select('cod')} />
          <div>
            <div className="font-medium">Cash on Delivery</div>
            <div className="text-sm text-neutral-500">Available for select pincodes</div>
          </div>
        </label>
      </div>
    </div>
  )
}

export default PaymentMethods
