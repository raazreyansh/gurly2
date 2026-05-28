'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/useCartStore'
import Link from 'next/link'
import Image from 'next/image'

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    removeItem,
    updateQuantity
  } = useCartStore()

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col bg-white border-l border-neutral-200 shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 p-6 bg-white">
              <h2 className="text-xs tracking-[0.3em] font-semibold text-black uppercase">
                YOUR BAG
              </h2>

              <button 
                onClick={closeCart}
                className="text-neutral-400 hover:text-black transition text-[9px] tracking-[0.2em] font-bold uppercase p-1"
              >
                ✕ Close
              </button>
            </div>

            {/* Items list container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold">Your bag is empty</p>
                  <button 
                    onClick={closeCart}
                    className="text-[10px] tracking-widest font-bold uppercase underline text-black hover:opacity-70 transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 border-b border-neutral-100 pb-6 last:border-0"
                  >
                    <div className="relative h-28 w-24 overflow-hidden border border-neutral-200 flex-shrink-0 bg-[#F5F5F3]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wider text-black">{item.title}</p>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-[9px] font-bold text-neutral-400 hover:text-red-500 transition uppercase"
                          >
                            Remove
                          </button>
                        </div>

                        {/* Adjust quantities */}
                        <div className="flex items-center gap-3 mt-3">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 border border-neutral-200 text-xs font-mono grid place-items-center hover:bg-neutral-50 text-black"
                          >
                            -
                          </button>
                          <span className="text-xs font-mono font-bold text-black">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 border border-neutral-200 text-xs font-mono grid place-items-center hover:bg-neutral-50 text-black"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <p className="font-mono font-bold text-xs text-black mt-2">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer triggers */}
            {items.length > 0 && (
              <div className="border-t border-neutral-200 p-6 bg-neutral-50 space-y-4">
                <div className="flex justify-between items-center text-xs tracking-wider font-semibold">
                  <span className="text-neutral-400 uppercase">Estimated Subtotal</span>
                  <span className="font-mono text-black text-sm font-bold">₹{subtotal.toLocaleString()}</span>
                </div>
                
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full bg-black py-5 text-xs tracking-[0.3em] font-semibold text-white uppercase hover:opacity-85 transition flex items-center justify-center"
                >
                  CHECKOUT
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
