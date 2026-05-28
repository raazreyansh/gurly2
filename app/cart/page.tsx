"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { useCartStore } from "@/store/useCartStore"
import Image from "next/image"
import { StorefrontLayout } from "@/components/layout/StorefrontLayout"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCartStore()
  const subtotal = getCartTotal()
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99
  const orderTotal = subtotal + shipping

  if (items.length === 0) {
    return (
      <StorefrontLayout>
        <main className="flex-1 flex flex-col items-center justify-center py-40 px-6 text-center bg-white min-h-[70vh]">
          <ShoppingBag size={48} strokeWidth={1} className="mx-auto text-neutral-300 mb-6" />
          <h1 className="font-serif text-3xl text-black mb-4">Your bag is empty</h1>
          <p className="text-neutral-500 text-sm mb-8">Browse the collection to add items.</p>
          <Link href="/shop" className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition">
            Continue Shopping
          </Link>
        </main>
      </StorefrontLayout>
    )
  }

  return (
    <StorefrontLayout>
      <main className="bg-white min-h-screen pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <header className="mb-16 border-b border-neutral-100 pb-8">
            <h1 className="font-serif text-4xl text-black">
              My Bag ({items.reduce((count, item) => count + item.quantity, 0)})
            </h1>
          </header>

          <div className="grid lg:grid-cols-12 gap-16">
            
            <div className="lg:col-span-8">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.article
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-6 py-8 border-b border-neutral-100"
                  >
                    <Link href={`/product/${item.product.slug}`} className="relative w-32 h-32 flex-shrink-0 bg-neutral-50">
                      <Image 
                        src={item.product.images?.[0] || '/product.png'} 
                        alt={item.product.title} 
                        fill
                        className="object-cover"
                      />
                    </Link>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/product/${item.product.slug}`} className="hover:opacity-70 transition">
                            <h2 className="font-sans font-medium text-sm text-black">{item.product.title}</h2>
                          </Link>
                          <p className="text-neutral-500 text-sm mt-1">Rs. {item.product.price.toLocaleString("en-IN")}</p>
                        </div>
                        <strong className="font-medium text-sm">Rs. {(item.product.price * item.quantity).toLocaleString("en-IN")}</strong>
                      </div>
                      
                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-4 border border-neutral-200 px-3 py-1">
                          <button type="button" onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="hover:opacity-60 transition">
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="hover:opacity-60 transition">
                            <Plus size={12} />
                          </button>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => {
                            removeItem(item.product.id)
                            toast.success("Removed from bag")
                          }}
                          className="text-xs text-neutral-400 hover:text-red-500 transition uppercase tracking-widest"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>

              <div className="mt-8 flex gap-6">
                <button
                  type="button"
                  onClick={() => {
                    clearCart()
                    toast.success("Cart cleared")
                  }}
                  className="text-xs uppercase tracking-widest text-neutral-400 hover:text-black transition"
                >
                  Clear bag
                </button>
                <Link href="/shop" className="text-xs uppercase tracking-widest border-b border-black pb-0.5 hover:opacity-60 transition">
                  Continue shopping
                </Link>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="bg-neutral-50 p-8">
                <h2 className="font-serif text-2xl mb-8">Summary</h2>
                
                <div className="space-y-4 text-sm text-neutral-600 border-b border-neutral-200 pb-6 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-8">
                  <span className="font-medium text-black">Total</span>
                  <span className="font-serif text-2xl text-black">Rs. {orderTotal.toLocaleString("en-IN")}</span>
                </div>
                
                {subtotal > 0 && subtotal < 999 && (
                  <p className="text-xs text-neutral-500 text-center mb-6">
                    Add Rs. {(999 - subtotal).toLocaleString("en-IN")} more for free shipping
                  </p>
                )}
                
                <Link href="/checkout" className="flex items-center justify-center gap-3 w-full bg-black text-white py-4 text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition">
                  Checkout <ArrowRight size={14} />
                </Link>
              </div>
            </aside>
            
          </div>
        </div>
      </main>
    </StorefrontLayout>
  )
}
