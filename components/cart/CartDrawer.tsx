'use client'

import { useCartStore } from '@/store/useCartStore'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import NextImage from '@/components/ui/NextImage'
import { X, Minus, Plus } from 'lucide-react'

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, getCartTotal } = useCartStore()
  const subtotal = getCartTotal()
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99
  const orderTotal = subtotal + shipping

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeCart}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-full flex flex-col"
          >
            <div className="absolute top-6 right-6 z-50">
              <button onClick={closeCart} className="bg-white/70 backdrop-blur-sm p-2 rounded-full shadow hover:scale-105 transition">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-8">
                <h2 className="font-serif text-2xl text-brandBlack">My Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})</h2>
                <p className="text-sm text-neutral-500 mt-1">A moment of quiet luxury — review your selections.</p>
              </div>

              {items.length === 0 ? (
                <div className="h-60 flex flex-col items-center justify-center text-center">
                  <p className="text-neutral-500 mb-6">Your bag is empty.</p>
                  <button
                    onClick={closeCart}
                    className="border-b border-brandBlack text-xs uppercase tracking-widest font-semibold hover:opacity-60 transition pb-1"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <Link href={`/product/${item.product.slug}`} onClick={closeCart} className="relative w-24 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-50">
                        <NextImage fill src={item.product.images?.[0] || '/product.png'} alt={item.product.title} />
                      </Link>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <Link href={`/product/${item.product.slug}`} onClick={closeCart} className="hover:opacity-60 transition">
                              <h3 className="font-sans text-sm font-medium text-brandBlack line-clamp-1">{item.product.title}</h3>
                            </Link>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-neutral-400 hover:text-black transition"
                              aria-label="Remove item"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">₹ {item.product.price.toLocaleString('en-IN')}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3 border border-neutral-200 px-2 py-1 rounded-md">
                            <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="hover:opacity-60 transition" aria-label="Decrease quantity">
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="hover:opacity-60 transition" aria-label="Increase quantity">
                              <Plus size={12} />
                            </button>
                          </div>
                          <strong className="text-sm">₹ {(item.product.price * item.quantity).toLocaleString('en-IN')}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6">
                <div className="rounded-xl bg-white/60 backdrop-blur-md border border-white/30 p-6 shadow-xl">
                  <div className="flex justify-between text-sm text-neutral-600 mb-2">
                    <span>Subtotal</span>
                    <span>₹ {subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-600 mb-4">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹ ${shipping}`}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-brandBlack">Total</span>
                    <span className="font-serif text-2xl">₹ {orderTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block w-full bg-brandBlack text-white text-center py-4 text-xs uppercase tracking-widest font-semibold rounded-md hover:opacity-90 transition"
                  >
                    Proceed to Checkout
                  </Link>
                  <div className="text-center mt-4">
                    <Link href="/cart" onClick={closeCart} className="text-xs uppercase tracking-widest border-b border-brandBlack pb-0.5 hover:opacity-60 transition">
                      View Bag
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
