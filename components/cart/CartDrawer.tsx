"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { useCart } from "@/store/cart"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, remove, update, total, clear, count } = useCart()
  const subtotal = total()
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99
  const orderTotal = subtotal + shipping

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/20" />
          <motion.aside
            data-testid="cart-drawer"
            className="relative w-full max-w-[380px] bg-white h-full flex flex-col border-l border-[#E8E8E8] font-sans"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Bag ({count()})</span>
              </div>
              <button type="button" onClick={onClose} aria-label="Close" className="w-8 h-8 flex items-center justify-center text-black/40 hover:text-black transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5">
                <ShoppingBag size={28} className="text-black/20" />
                <p className="text-[11px] font-black uppercase tracking-widest text-black/30">Your bag is empty</p>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 hover:bg-neutral-800 transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-3 px-5 py-4 border-b border-[#E8E8E8]"
                      >
                        <img src={item.image} alt={item.title} className="w-14 h-18 object-cover bg-[#F5F5F5] shrink-0" style={{ height: "72px" }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold uppercase tracking-wide truncate">{item.title}</p>
                          <p className="text-[11px] text-black/50 mt-0.5">₹{item.price.toLocaleString("en-IN")}</p>
                          <div className="flex items-center mt-2 border border-[#E8E8E8] w-fit">
                            <button type="button" onClick={() => update(item.productId, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-black/40 hover:text-black transition-colors" aria-label="Decrease">
                              <Minus size={9} />
                            </button>
                            <span className="w-6 text-center text-[11px] font-bold">{item.quantity}</span>
                            <button type="button" onClick={() => update(item.productId, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-black/40 hover:text-black transition-colors" aria-label="Increase">
                              <Plus size={9} />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between shrink-0">
                          <button
                            type="button"
                            onClick={() => { remove(item.productId); toast.success("Removed") }}
                            className="text-black/20 hover:text-black transition-colors"
                            aria-label="Remove"
                          >
                            <Trash2 size={12} />
                          </button>
                          <p className="text-[11px] font-bold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-5 py-5 border-t border-[#E8E8E8] space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-black/50">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-black/50">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-[12px] font-black uppercase tracking-widest pt-2 border-t border-[#E8E8E8]">
                    <span>Total</span>
                    <span>₹{orderTotal.toLocaleString("en-IN")}</span>
                  </div>
                  {subtotal < 999 && subtotal > 0 && (
                    <p className="text-[9px] font-medium text-black/30 text-center">
                      Add ₹{(999 - subtotal).toLocaleString("en-IN")} more for free shipping
                    </p>
                  )}
                  <Link
                    href="/checkout"
                    id="drawer-checkout-btn"
                    onClick={onClose}
                    className="w-full py-3.5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                  >
                    Checkout <ArrowRight size={12} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => { clear(); toast.success("Bag cleared") }}
                    className="w-full text-center text-[9px] font-bold uppercase tracking-widest text-black/30 hover:text-black transition-colors py-1"
                  >
                    Clear bag
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
