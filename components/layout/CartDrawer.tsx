'use client'

import { useCartStore } from '@/store/useCartStore'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartDrawer() {
  const { isOpen, items, toggleCart, updateQuantity, removeItem } = useCartStore()

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 z-50 bg-black"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex h-20 items-center justify-between border-b border-neutral-100 px-6">
              <span className="font-serif text-xl font-medium tracking-wide text-black">
                Shopping Bag ({items.reduce((a, b) => a + b.quantity, 0)})
              </span>
              <button
                onClick={toggleCart}
                className="rounded-full p-2 hover:bg-neutral-50 transition text-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 divide-y divide-neutral-100">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="h-12 w-12 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
                    <ShoppingBag className="h-5 w-5 text-neutral-400" />
                  </div>
                  <p className="font-serif text-lg text-black">Your bag is empty</p>
                  <p className="text-xs text-neutral-400 mt-2 max-w-xs leading-relaxed">
                    Explore our curated premium jewellery selections to start your journey.
                  </p>
                  <button
                    onClick={toggleCart}
                    className="mt-6 bg-black text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:opacity-85 transition"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-6 first:pt-0">
                    <div className="relative h-28 w-20 flex-shrink-0 bg-neutral-50 border border-neutral-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <p className="text-xs tracking-wider font-semibold text-black uppercase">{item.title}</p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-neutral-400 hover:text-red-500 transition ml-2"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 font-mono">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-neutral-200">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-neutral-50 text-black transition"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-xs font-semibold text-black font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-neutral-50 text-black transition"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-xs font-semibold text-black font-mono">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="border-t border-neutral-100 p-6 bg-neutral-50">
                <div className="flex justify-between text-sm font-semibold mb-2 text-black">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{subtotal.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-normal mb-6">
                  Shipping, taxes, and discounts calculated at checkout.
                </p>

                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    onClick={toggleCart}
                    className="block w-full bg-black text-center text-white py-4 text-xs uppercase tracking-widest font-semibold hover:opacity-85 transition"
                  >
                    Proceed To Checkout
                  </Link>
                  <button
                    onClick={toggleCart}
                    className="block w-full text-center text-neutral-600 hover:text-black py-2 text-xs uppercase tracking-widest font-semibold transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
