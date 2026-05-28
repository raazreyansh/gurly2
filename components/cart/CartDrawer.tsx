'use client'

import { useCartStore } from '@/store/useCartStore'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
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
            className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="font-serif text-2xl text-black">
                My Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
              <button onClick={closeCart} className="hover:opacity-60 transition">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-neutral-500 mb-6">Your bag is empty.</p>
                  <button 
                    onClick={closeCart}
                    className="border-b border-black text-xs uppercase tracking-widest font-semibold hover:opacity-60 transition pb-1"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <Link href={`/product/${item.product.slug}`} onClick={closeCart} className="relative w-20 h-24 flex-shrink-0 bg-neutral-50">
                        <Image 
                          src={item.product.images?.[0] || '/product.png'} 
                          alt={item.product.title}
                          fill
                          className="object-cover" 
                        />
                      </Link>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <Link href={`/product/${item.product.slug}`} onClick={closeCart} className="hover:opacity-60 transition">
                              <h3 className="font-sans text-sm font-medium text-black line-clamp-1">{item.product.title}</h3>
                            </Link>
                            <button 
                              onClick={() => removeItem(item.product.id)}
                              className="text-neutral-400 hover:text-black transition"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">Rs. {item.product.price.toLocaleString('en-IN')}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3 border border-neutral-200 px-2 py-1">
                            <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="hover:opacity-60 transition">
                              <Minus size={10} />
                            </button>
                            <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="hover:opacity-60 transition">
                              <Plus size={10} />
                            </button>
                          </div>
                          <strong className="text-sm">Rs. {(item.product.price * item.quantity).toLocaleString('en-IN')}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-neutral-100 p-6 bg-neutral-50">
                <div className="flex justify-between text-sm text-neutral-600 mb-2">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-600 mb-6">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `Rs. ${shipping}`}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-medium text-black">Total</span>
                  <span className="font-serif text-xl">Rs. {orderTotal.toLocaleString('en-IN')}</span>
                </div>
                <Link 
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-black text-white text-center py-4 text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition"
                >
                  Proceed to Checkout
                </Link>
                <div className="text-center mt-4">
                  <Link href="/cart" onClick={closeCart} className="text-xs uppercase tracking-widest border-b border-black pb-0.5 hover:opacity-60 transition">
                    View Bag
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
