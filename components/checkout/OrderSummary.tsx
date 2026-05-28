'use client'

import { useCartStore } from '@/store/useCartStore'

export default function OrderSummary() {
  const { items } = useCartStore()

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )

  const shipping = subtotal === 0 || subtotal > 999 ? 0 : 99
  const tax = subtotal * 0.18
  const total = subtotal + shipping + tax

  return (
    <div className="bg-neutral-50 p-8 lg:p-16 border-l border-neutral-200">
      <h2 className="mb-10 text-xs font-semibold tracking-[0.3em] text-neutral-400 uppercase">
        ORDER SUMMARY
      </h2>

      <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 hide-scrollbar">
        {items.length === 0 ? (
          <div className="border border-dashed border-neutral-200 bg-white p-8 text-center text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Your cart is empty
          </div>
        ) : items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 items-center"
          >
            <div className="h-20 w-16 bg-neutral-100 flex-shrink-0 relative overflow-hidden border border-neutral-200">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider font-semibold text-black leading-snug">{item.title}</p>
              <p className="mt-1 text-xs text-neutral-400 font-semibold font-mono">
                Qty: {item.quantity}
              </p>
            </div>

            <p className="text-xs font-semibold font-mono text-black">
              ₹{(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 space-y-4 border-t border-neutral-200 pt-8 text-xs font-semibold text-neutral-500 uppercase tracking-widest">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-mono text-black">₹{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="font-mono text-black">
            {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Estimated GST (18%)</span>
          <span className="font-mono text-black">₹{tax.toLocaleString()}</span>
        </div>

        <div className="flex justify-between border-t border-neutral-200 pt-6 text-sm text-black">
          <span>Total</span>
          <span className="font-mono font-bold text-lg">₹{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
