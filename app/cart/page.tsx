"use client"

import { useCart } from "@/store/cart"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function CartPage() {
  const { items, remove, update, total, clear } = useCart()
  const subtotal = total()
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99
  const orderTotal = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32 px-6">
          <div className="text-center">
            <ShoppingBag size={32} className="text-black/20 mx-auto mb-6" />
            <p className="text-[11px] font-black uppercase tracking-widest text-black/30 mb-8">Your bag is empty</p>
            <Link href="/shop" className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-8 py-3.5 hover:bg-neutral-800 transition-colors">
              Shop Now
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-14">
        {/* Page title */}
        <div className="border-b border-[#E8E8E8]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6">
            <h1 className="text-xl font-black uppercase tracking-tight">Bag ({items.reduce((a, b) => a + b.quantity, 0)})</h1>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">

            {/* Items */}
            <div>
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-5 py-5 border-b border-[#E8E8E8]"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-24 object-cover bg-[#F5F5F5] shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide truncate">{item.title}</p>
                        <p className="text-sm text-black/50 mt-0.5">₹{item.price.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-[#E8E8E8]">
                          <button
                            id={`qty-minus-${item.productId}`}
                            type="button"
                            onClick={() => update(item.productId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-black/40 hover:text-black transition-colors"
                            aria-label="Decrease"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            id={`qty-plus-${item.productId}`}
                            type="button"
                            onClick={() => update(item.productId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-black/40 hover:text-black transition-colors"
                            aria-label="Increase"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                        <button
                          id={`remove-${item.productId}`}
                          type="button"
                          onClick={() => { remove(item.productId); toast.success("Removed") }}
                          className="text-black/20 hover:text-black transition-colors"
                          aria-label="Remove"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-bold shrink-0">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => { clear(); toast.success("Bag cleared") }}
                  className="text-[10px] font-bold uppercase tracking-widest text-black/30 hover:text-black transition-colors"
                >
                  Clear bag
                </button>
                <Link href="/shop" className="text-[10px] font-bold uppercase tracking-widest text-black/30 hover:text-black transition-colors">
                  Continue shopping →
                </Link>
              </div>
            </div>

            {/* Summary */}
            <aside className="border border-[#E8E8E8] p-6 space-y-4 sticky top-20">
              <h2 className="text-[10px] font-black uppercase tracking-widest mb-5">Summary</h2>
              <div className="flex justify-between text-[11px] font-medium text-black/60">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[11px] font-medium text-black/60">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              {subtotal > 0 && subtotal < 999 && (
                <p className="text-[9px] text-black/30 font-medium">
                  Add ₹{(999 - subtotal).toLocaleString("en-IN")} more for free shipping
                </p>
              )}
              <div className="border-t border-[#E8E8E8] pt-4 flex justify-between text-[13px] font-black uppercase tracking-tight">
                <span>Total</span>
                <span>₹{orderTotal.toLocaleString("en-IN")}</span>
              </div>
              <Link
                href="/checkout"
                id="proceed-checkout-btn"
                className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                Checkout <ArrowRight size={12} />
              </Link>
            </aside>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
