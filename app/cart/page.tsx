"use client"

import { useCart } from "@/store/cart"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Gift, Award } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function CartPage() {
  const { items, remove, update, total, clear } = useCart()
  const subtotal = total()
  const shippingThreshold = 999
  const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 99
  const remainingForFreeShipping = shippingThreshold - subtotal
  const progressPercent = Math.min((subtotal / shippingThreshold) * 100, 100)

  if (items.length === 0) {
    return (
      <div className="storefront-shell bg-[#0C0C0C] text-[#FEFDF0] flex flex-col min-h-screen font-sans">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-32 px-6">
          <motion.div 
            className="bg-[#141414] border border-[#FEFDF0]/5 max-w-lg w-full text-center p-16 rounded-none"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 bg-[#FFE600]/10 text-[#FFE600] rounded-none flex items-center justify-center mx-auto mb-8">
              <ShoppingBag size={24} />
            </div>
            <h1 className="font-serif text-3xl font-light mb-4">Your Shopping Bag is Empty</h1>
            <p className="text-[#A6A498] text-xs max-w-sm mx-auto mb-10 leading-relaxed uppercase tracking-wider">
              Looks like you haven&apos;t added any luxury jewelry or premium accessories to your selection yet.
            </p>
            <Link href="/shop" className="px-8 py-4 bg-[#FFE600] hover:bg-white text-black text-[10px] uppercase font-extrabold tracking-widest transition-colors duration-300 rounded-none inline-block">
              Explore Our Store
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="storefront-shell bg-[#0C0C0C] text-[#FEFDF0] flex flex-col min-h-screen font-sans">
      <Navbar />
      
      <main className="flex-grow pb-32 pt-24">
        {/* Luxury Page Header */}
        <div className="py-16 bg-[#0E0E0E] border-b border-[#FEFDF0]/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-left">
            <p className="text-[9px] font-extrabold tracking-[0.25em] text-[#FFE600] uppercase mb-2">LUXURY SELECTION</p>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-[#FEFDF0]">Your Shopping Bag</h1>
            <p className="text-[#A6A498] text-xs mt-3 uppercase tracking-wider">
              {items.reduce((a, b) => a + b.quantity, 0)} item{items.reduce((a, b) => a + b.quantity, 0) !== 1 ? "s" : ""} selected
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Cart Line Items */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div 
                      key={item.productId} 
                      className="bg-[#141414] border border-[#FEFDF0]/5 p-6 rounded-none grid grid-cols-1 sm:grid-cols-[100px_1fr_auto] gap-6 items-center text-left"
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full sm:w-[100px] h-[130px] object-cover border border-[#FEFDF0]/5 rounded-none flex-shrink-0"
                      />
                      <div className="space-y-3">
                        <span className="text-[9px] font-extrabold tracking-widest text-[#FFE600] uppercase">Earrings & Accessories</span>
                        <h3 className="font-serif text-xl font-light text-[#FEFDF0] hover:text-[#FFE600] transition-colors">{item.title}</h3>
                        <p className="text-[#FFE600] font-mono text-sm">₹{item.price.toLocaleString("en-IN")}</p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-6 pt-2">
                          <div className="flex items-center border border-[#FEFDF0]/10 bg-[#0C0C0C] font-extrabold">
                            <button
                              id={`qty-minus-${item.productId}`}
                              type="button"
                              className="px-3 py-1.5 hover:text-[#FFE600] transition-colors text-xs"
                              onClick={() => update(item.productId, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="px-3 text-xs font-mono">{item.quantity}</span>
                            <button
                              id={`qty-plus-${item.productId}`}
                              type="button"
                              className="px-3 py-1.5 hover:text-[#FFE600] transition-colors text-xs"
                              onClick={() => update(item.productId, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                          
                          <button
                            id={`remove-${item.productId}`}
                            type="button"
                            className="text-[#A6A498] hover:text-[#EF4444] transition-colors duration-200"
                            onClick={() => { 
                              remove(item.productId); 
                              toast.success(`${item.title} removed from bag`, {
                                style: {
                                  background: "#161616",
                                  color: "#FEFDF0",
                                  border: "1px solid #FFE600",
                                  borderRadius: "0px"
                                }
                              }) 
                            }}
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="font-mono text-lg text-[#FFE600] font-extrabold sm:text-right">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#FEFDF0]/10 uppercase text-[9px] font-extrabold tracking-widest">
                <button 
                  onClick={() => {
                    clear();
                    toast.success("Cart cleared", {
                      style: {
                        background: "#161616",
                        color: "#FEFDF0",
                        border: "1px solid #FFE600",
                        borderRadius: "0px"
                      }
                    })
                  }}
                  className="text-[#A6A498] hover:text-[#FFE600] transition-colors"
                >
                  Clear Shopping Bag
                </button>
                <Link href="/shop" className="text-[#FFE600] hover:text-white border-b border-[#FFE600]/30 hover:border-white pb-0.5 transition-all">
                  Continue Discovery
                </Link>
              </div>
            </div>

            {/* Sticky Order Summary */}
            <div className="lg:col-span-1">
              <aside className="bg-[#141414] border border-[#FEFDF0]/5 p-8 rounded-none space-y-6 text-left">
                <h2 className="font-serif text-2xl font-light text-[#FEFDF0]">Order Summary</h2>

                {/* Free Shipping bar */}
                <div className="bg-[#0C0C0C] border border-[#FFE600]/10 p-5">
                  {subtotal >= shippingThreshold ? (
                    <p className="text-[10px] font-extrabold tracking-widest text-[#58B47E] text-center uppercase">
                      ✨ FREE SHIPPING UNLOCKED!
                    </p>
                  ) : (
                    <>
                      <p className="text-[10px] font-extrabold tracking-widest text-[#D4D2C5] text-center mb-3 uppercase">
                        Add <strong className="text-[#FFE600]">₹{remainingForFreeShipping.toLocaleString("en-IN")}</strong> more for <strong className="text-[#FFE600]">FREE shipping</strong>
                      </p>
                      <div className="bg-[#FEFDF0]/5 h-1 w-full overflow-hidden">
                        <div 
                          className="bg-[#FFE600] h-full" 
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4 text-xs font-extrabold uppercase tracking-widest text-[#A6A498] border-b border-[#FEFDF0]/10 pb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#FEFDF0] font-mono">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-[#58B47E] font-extrabold" : "text-[#FEFDF0]"}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Keepsake Wrapping</span>
                    <span className="text-[#58B47E] font-extrabold">FREE</span>
                  </div>
                </div>

                <div className="space-y-2 pb-6 border-b border-[#FEFDF0]/10">
                  <div className="flex justify-between text-[#FEFDF0] uppercase tracking-widest font-extrabold text-sm">
                    <span>Total</span>
                    <span className="font-mono text-[#FFE600] text-lg font-light">₹{(subtotal + shipping).toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-[8px] text-[#A6A498] tracking-widest text-right uppercase">GST & Custom Duties Included</p>
                </div>

                <div className="space-y-4">
                  <Link 
                    href="/checkout" 
                    className="w-full py-4 bg-[#FFE600] hover:bg-white text-black text-[10px] uppercase font-extrabold tracking-widest transition-colors flex items-center justify-center gap-2 rounded-none"
                    id="proceed-checkout-btn"
                  >
                    Proceed to Checkout <ArrowRight size={13} />
                  </Link>
                </div>

                {/* Trust Seals */}
                <div className="space-y-3 pt-6 border-t border-[#FEFDF0]/10 text-[9px] font-extrabold tracking-widest uppercase text-[#A6A498]">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={14} className="text-[#FFE600]" />
                    <span>Secure 256-bit SSL Checkout</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Gift size={14} className="text-[#FFE600]" />
                    <span>Luxury Keepsake packaging included</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award size={14} className="text-[#FFE600]" />
                    <span>Hypoallergenic skin-friendly finish</span>
                  </div>
                </div>
              </aside>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
