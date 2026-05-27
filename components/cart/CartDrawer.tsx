"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { useCart } from "@/store/cart"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, remove, update, total, clear, count } = useCart()
  const subtotal = total()
  const shippingThreshold = 999
  const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 99
  const remainingForFreeShipping = shippingThreshold - subtotal
  const progressPercent = Math.min((subtotal / shippingThreshold) * 100, 100)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.aside
            data-testid="cart-drawer"
            className="w-full max-w-md bg-[#041C12] text-[#F7F4EB] h-full border-l border-[#DFBA73]/15 flex flex-col p-6 font-sans relative"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onClick={(event) => event.stopPropagation()}
            aria-label="Shopping cart drawer"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-6 border-b border-[#DFBA73]/15">
              <div className="text-left">
                <p className="text-[8px] font-extrabold tracking-[0.25em] text-[#DFBA73] uppercase mb-1">Sovereign Tray</p>
                <h2 className="font-serif text-2xl font-light">Your Ledger</h2>
              </div>
              <button type="button" onClick={onClose} className="w-10 h-10 hover:text-[#DFBA73] flex items-center justify-center transition-colors" aria-label="Close cart">
                <X size={18} />
              </button>
            </div>

            {/* Free Shipping Progress Driver */}
            {items.length > 0 && (
              <div className="bg-[#03170F] border border-[#DFBA73]/10 p-4 my-5 text-left">
                {subtotal >= shippingThreshold ? (
                  <p className="text-[9px] font-extrabold tracking-widest text-[#58B47E] flex items-center gap-1.5 justify-center uppercase mb-3">
                    <Sparkles size={11} fill="currentColor" /> FREE SHIPPING UNLOCKED!
                  </p>
                ) : (
                  <p className="text-[9px] font-extrabold tracking-widest text-[#C8C5B9] uppercase mb-3">
                    Add <strong className="text-[#DFBA73]">₹{remainingForFreeShipping.toLocaleString("en-IN")}</strong> more for <strong className="text-[#DFBA73]">FREE shipping</strong>
                  </p>
                )}
                <div className="w-full h-1 bg-[#F7F4EB]/5">
                  <motion.div 
                    className="h-full bg-[#DFBA73]" 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {/* Content area */}
            {items.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center px-4 space-y-5">
                <ShoppingBag size={36} className="text-[#DFBA73]" />
                <h3 className="font-serif text-lg font-light">Your ledger is empty</h3>
                <p className="text-xs text-[#C8C5B9] leading-relaxed uppercase tracking-wider">Start with curated earrings, bracelets, necklaces, or premium accessories.</p>
                <Link href="/shop" className="px-8 py-3.5 bg-[#DFBA73] hover:bg-[#F7F4EB] text-[#041C12] text-[9px] uppercase font-extrabold tracking-widest transition-colors duration-300 rounded-none" onClick={onClose}>
                  Start Discovery
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-grow overflow-y-auto space-y-4 pr-1 my-3 scrollbar-thin scrollbar-thumb-[#03170F]">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.article 
                        className="bg-[#03170F] border border-[#DFBA73]/10 p-4 flex gap-4 relative text-left" 
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img src={item.image} alt={item.title} className="w-16 h-20 object-cover border border-[#DFBA73]/10" loading="lazy" />
                        <div className="flex flex-col justify-between flex-grow">
                          <div>
                            <h3 className="text-xs uppercase tracking-widest font-extrabold text-[#F7F4EB] truncate pr-6">{item.title}</h3>
                            <p className="text-xs text-[#DFBA73] font-mono mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                          </div>
                          <div className="flex items-center border border-[#DFBA73]/20 self-start bg-[#041C12] text-[11px] font-mono mt-2">
                            <button type="button" className="px-2.5 py-1 hover:text-[#DFBA73]" aria-label="Decrease quantity" onClick={() => update(item.productId, item.quantity - 1)}>
                              <Minus size={10} />
                            </button>
                            <span className="px-2">{item.quantity}</span>
                            <button type="button" className="px-2.5 py-1 hover:text-[#DFBA73]" aria-label="Increase quantity" onClick={() => update(item.productId, item.quantity + 1)}>
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="absolute top-4 right-4 text-[#C8C5B9] hover:text-[#EF4444] transition-colors"
                          aria-label={`Remove ${item.title}`}
                          onClick={() => {
                            remove(item.productId)
                            toast.success(`${item.title} removed from ledger`, {
                              icon: "🗑️",
                              style: {
                                background: "#041C12",
                                color: "#F7F4EB",
                                border: "1px solid #DFBA73",
                                borderRadius: "0px"
                              }
                            })
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Drawer Summary Footer */}
                <div className="border-t border-[#DFBA73]/15 pt-6 space-y-3.5 text-[9px] text-[#C8C5B9] uppercase tracking-widest font-extrabold text-left">
                  <div className="flex justify-between">
                    <span>Ledger Items</span>
                    <span className="text-[#F7F4EB]">{count()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#F7F4EB] font-mono">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-[#F7F4EB]">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#F7F4EB] pt-3 border-t border-[#DFBA73]/10">
                    <span>Total Valuation</span>
                    <strong className="text-[#DFBA73] font-mono font-light text-base">₹{(subtotal + shipping).toLocaleString("en-IN")}</strong>
                  </div>
                  <Link href="/checkout" id="drawer-checkout-btn" className="w-full py-4 bg-[#DFBA73] hover:bg-[#F7F4EB] text-[#041C12] text-[10px] uppercase font-extrabold tracking-widest transition-colors flex items-center justify-center gap-2 rounded-none mt-2" onClick={onClose}>
                    Checkout <ArrowRight size={13} />
                  </Link>
                  <button
                    type="button"
                    className="w-full py-2.5 text-center text-[8px] uppercase tracking-widest font-extrabold text-[#C8C5B9] hover:text-[#DFBA73] transition-colors"
                    onClick={() => {
                      clear()
                      toast.success("Ledger cleared", {
                        style: {
                          background: "#041C12",
                          color: "#F7F4EB",
                          border: "1px solid #DFBA73",
                          borderRadius: "0px"
                        }
                      })
                    }}
                  >
                    Clear Ledger
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
